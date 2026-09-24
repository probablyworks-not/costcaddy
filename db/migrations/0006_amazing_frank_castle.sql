-- ADR-0008: the audit date range is the recurring conduct window agreed with the
-- auditor, not a submission deadline, so the columns are renamed off "due" naming
-- (dueStart/dueDate -> periodStart/periodEnd) to stop implying a deadline in the schema.
ALTER TABLE "audits" RENAME COLUMN "due_start" TO "period_start";--> statement-breakpoint
ALTER TABLE "audits" RENAME COLUMN "due_date" TO "period_end";
