import { KPICard } from "@/components/dashboard-ui/KPICard";
import { Flame, Snowflake } from "lucide-react";

export default function LeadTemperature({ temperature }) {
  const hot = temperature?.hot || 0;
  const cold = temperature?.cold || 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <KPICard
        value={hot}
        title="Hot Leads"
        subtitle="Score ≥ 75"
        icon={Flame}
        variant="danger"
      />
      <KPICard
        value={cold}
        title="Cold Leads"
        subtitle="Score < 75"
        icon={Snowflake}
        variant="cyan"
      />
    </div>
  );
}