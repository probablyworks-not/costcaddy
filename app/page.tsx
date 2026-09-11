import { AppHeader } from "@/components/ui/AppHeader";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { CalculatedField } from "@/components/ui/CalculatedField";
import { GroupedPanel } from "@/components/ui/GroupedPanel";
import { DepartmentChip } from "@/components/ui/DepartmentChip";
import { ListRow } from "@/components/ui/ListRow";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OverdueMarker } from "@/components/ui/OverdueMarker";
import { KpiStrip } from "@/components/report/KpiStrip";
import { ReportTable } from "@/components/report/ReportTable";

// F2 smoke test — every one of the 12 core primitives, wired to real tokens.
// Not a product screen; replaced once A1/B1 build the real ones.
export default function Home() {
  return (
    <div>
      <AppHeader>
        <RoleBadge>Super Admin</RoleBadge>
      </AppHeader>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "var(--space-11)", display: "flex", flexDirection: "column", gap: "var(--space-11)" }}>
        <GroupedPanel title="Coastline Bistro" hint="6 departments in this template" progress="4 of 12">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <ListRow
              icon={<DepartmentChip>KIT</DepartmentChip>}
              title="Kitchen"
              meta="8 of 9 answered"
              status={<OverdueMarker />}
            />
            <ListRow icon={<DepartmentChip>SEC</DepartmentChip>} title="Security" meta="6 of 6 answered" />
          </div>
          <div style={{ marginTop: "var(--space-8)" }}>
            <ProgressBar value={4} max={12} />
          </div>
        </GroupedPanel>

        <div style={{ display: "flex", gap: "var(--space-8)", alignItems: "flex-end" }}>
          <TextInput label="Covers" numeric placeholder="0" />
          <CalculatedField label="Net Sale">₹4,12,300</CalculatedField>
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
        </div>

        <section style={{ background: "var(--r-bg)", padding: "var(--space-11)", borderRadius: "var(--radius-card)", display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          <KpiStrip
            items={[
              { key: "gross", label: "Gross Sales", value: "₹113.20L", sub: { label: "Per Pax", value: "₹456" } },
              { key: "covers", label: "Total Pax (Covers)", value: "24,850", sub: { label: "Daily Avg", value: "273 / day" } },
            ]}
          />
          <ReportTable
            columns={[
              { key: "category", label: "Category" },
              { key: "sales", label: "Sales (₹)", align: "right" },
              { key: "apc", label: "APC (₹)", align: "right", emphasis: true },
            ]}
            rows={[
              { id: "food", dotColor: "var(--status-pass-bg-deep)", cells: { category: "Food", sales: "₹62,40,000", apc: "₹280.91" } },
              { id: "bar", zebra: true, dotColor: "var(--navy-700)", cells: { category: "Bar", sales: "₹18,20,000", apc: "₹95.40" } },
            ]}
          />
        </section>
      </main>
    </div>
  );
}
