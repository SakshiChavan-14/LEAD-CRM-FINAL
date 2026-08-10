import { Users, PhoneCall, Heart, CheckCircle2, Target } from "lucide-react";

import { KPICard, KPICardSkeleton } from "@/components/dashboard-ui/KPICard";

export default function KPISection({ isLoading, summary }) {
  if (isLoading) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => <KPICardSkeleton key={i} />)}
      </section>
    );
  }

  if (!summary) return null;

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard
        title="Assigned"
        value={summary.assigned}
        icon={Users}
        variant="primary"
        href="/telecaller/leads?status=ALL"
      />
      <KPICard
        title="Calls Today"
        value={summary.callsToday}
        icon={PhoneCall}
        variant="info"
        href="/telecaller/calls?date=today"
      />
      <KPICard
        title="Connected"
        value={summary.connected}
        icon={PhoneCall}
        variant="success"
        href="/telecaller/calls?status=CONNECTED"
      />
      <KPICard
        title="Interested"
        value={summary.interested}
        icon={Heart}
        variant="success"
        href="/telecaller/leads?status=INTERESTED"
      />
      <KPICard
        title="Admissions"
        value={summary.admissions}
        icon={CheckCircle2}
        variant="primary"
        href="/telecaller/leads?status=ADMISSION"
      />
      <KPICard
        title="Goal %"
        value={`${summary.goal}%`}
        icon={Target}
        variant="neutral"
      />
    </section>
  );
}
