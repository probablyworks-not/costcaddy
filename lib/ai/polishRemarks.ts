import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { auditItems, audits } from '@/db/schema';

const PolishedRemarksSchema = z.object({
  remarks: z.array(z.object({ id: z.string(), polished: z.string() })),
});

const POLISH_TIMEOUT_MS = 30_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Polish timed out')), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

// B6 (ADR-0004) — queued from `submitAudit` via `after()`, never awaited by the
// request that triggers it. Rewrites every non-pass remark into report prose and
// *replaces* the raw remark (no `rawRemark` kept — the polish is the record). A
// failure or timeout here must never surface to the auditor or touch the submit
// itself: the audit is already `submitted`; this only affects how its remarks read
// afterward. The model rewrites prose only — it never computes or invents a number.
export async function polishAuditRemarks(auditId: string): Promise<void> {
  try {
    const items = await db
      .select({ id: auditItems.id, label: auditItems.label, remark: auditItems.remark, status: auditItems.status })
      .from(auditItems)
      .where(eq(auditItems.auditId, auditId));

    const toPolish = items.filter((it) => it.status !== 'pass' && it.status !== 'pending' && it.remark.trim() !== '');
    if (toPolish.length === 0) {
      await db.update(audits).set({ polishState: 'ready' }).where(eq(audits.id, auditId));
      return;
    }

    const client = new Anthropic();
    const response = await withTimeout(
      client.messages.parse({
        model: 'claude-opus-5',
        max_tokens: 4096,
        system:
          "You turn a field auditor's shorthand notes into polished, professional report prose for a " +
          'restaurant audit report. Rewrite each remark as one or two clear sentences suitable for a ' +
          "client-facing PDF. Preserve every fact exactly: never add, remove, or change a number, quantity, " +
          "date, unit, or proper noun that appears in the original, and never invent a figure that isn't " +
          "already there. Keep the auditor's meaning intact — you are copy-editing, not re-assessing the " +
          'finding. Return exactly one rewritten remark per input id.',
        messages: [
          {
            role: 'user',
            content: JSON.stringify(toPolish.map((it) => ({ id: it.id, checkpoint: it.label, remark: it.remark }))),
          },
        ],
        output_config: { format: zodOutputFormat(PolishedRemarksSchema) },
      }),
      POLISH_TIMEOUT_MS,
    );

    const parsed = response.parsed_output;
    if (!parsed) throw new Error('Polish response failed to parse');

    const polishedById = new Map(parsed.remarks.map((r) => [r.id, r.polished]));
    await db.transaction(async (tx) => {
      for (const it of toPolish) {
        const polished = polishedById.get(it.id);
        if (polished && polished.trim() !== '') {
          await tx.update(auditItems).set({ remark: polished }).where(eq(auditItems.id, it.id));
        }
      }
      await tx.update(audits).set({ polishState: 'ready' }).where(eq(audits.id, auditId));
    });
  } catch {
    // Never blocks or reverses the submit (ADR-0004) — unpolished remarks pass
    // through verbatim; only the visible status changes.
    try {
      await db.update(audits).set({ polishState: 'failed' }).where(eq(audits.id, auditId));
    } catch {
      // Best-effort status update; nothing else to do if even this fails.
    }
  }
}
