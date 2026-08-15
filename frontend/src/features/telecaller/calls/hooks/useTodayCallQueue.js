import { useMemo } from "react";
import { useTelecallerLeads } from "@/features/telecaller/hooks/useMyLeads";
import { useFollowups } from "@/features/telecaller/hooks/useFollowups";
import { useCallHistory } from "@/features/telecaller/voice/hooks/useCallHistory";
import { createCallQueueModel } from "../utils/callQueueEngine";

export function useTodayCallQueue() {
  const { data: leadsData, isLoading: leadsLoading } = useTelecallerLeads({}, 0, 100);
  const { data: followups, isLoading: followupsLoading } = useFollowups("all");
  const { data: calls, isLoading: callsLoading } = useCallHistory();

  const leads = leadsData?.leads || [];

  const model = useMemo(() => {
    return createCallQueueModel(leads, followups || [], calls || []);
  }, [leads, followups, calls]);

  const isLoading = leadsLoading || followupsLoading || callsLoading;

  return {
    ...model,
    isLoading,
  };
}
