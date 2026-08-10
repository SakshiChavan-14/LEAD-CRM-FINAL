"use client";

import React, { useMemo } from "react";
import DataTable from "@/components/table/DataTable";
import { useCallHistory } from "@/features/telecaller/voice/hooks/useCallHistory";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";
import CallDetailsModal from "@/features/telecaller/voice/components/details/CallDetailsModal";
import { getRecentCallsColumns } from "./recentCallsColumns";

export default function RecentCallsTable() {
  const { data: calls, isLoading } = useCallHistory();
  const { selectedCallId, setSelectedCallId } = useVoice();

  // The hook might return the calls directly or inside an object, but based on the original component it's:
  // const recentCalls = (calls || []).sort(...).slice(0, 20);
  const recentCalls = useMemo(() => {
    return (calls || [])
      .sort((a, b) => new Date(b.callDateTime || b.createdAt || b.date) - new Date(a.callDateTime || a.createdAt || a.date))
      .slice(0, 20);
  }, [calls]);

  const columns = useMemo(() => getRecentCallsColumns(setSelectedCallId), [setSelectedCallId]);

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-[#ECECEC] overflow-hidden">
      <DataTable
        columns={columns}
        data={recentCalls}
        rowKey={(row) => row.callId || row.id || row.interactionId}
        loading={isLoading}
        selectable={false}
        skeletonRows={5}
        onRowClick={(row) => {
          const callId = row.callId || row.id || row.interactionId;
          setSelectedCallId(callId);
        }}
      />

      {selectedCallId && (
        <CallDetailsModal 
          callId={selectedCallId}
          open={!!selectedCallId} 
          defaultTab="summary"
          onClose={() => setSelectedCallId(null)} 
        />
      )}
    </div>
  );
}
