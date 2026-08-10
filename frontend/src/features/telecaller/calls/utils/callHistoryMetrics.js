export function calculateCallMetrics(calls = []) {
  if (!calls || calls.length === 0) {
    return {
      totalCalls: 0,
      connectedCalls: 0,
      missedCalls: 0,
      busyCalls: 0,
      averageDuration: "0m 0s",
      recordings: 0,
      connectionRate: "0%"
    };
  }

  let totalDuration = 0;
  let connected = 0;
  let missed = 0;
  let busy = 0;
  let recordings = 0;

  let maxDuration = 0;

  calls.forEach(call => {
    const outcome = call.outcome || call.callOutcome || "Unknown";
    const duration = Number(call.callDurationSeconds || call.callDuration || call.duration || 0);
    const hasRecording = call.recordingUrl && call.recordingUrl.trim() !== "";

    totalDuration += duration;
    
    if (duration > maxDuration) {
      maxDuration = duration;
    }

    if (outcome === "Connected") {
      connected++;
    } else if (outcome === "No Answer" || outcome === "Missed" || outcome === "Failed") {
      missed++;
    } else if (outcome === "Busy") {
      busy++;
    }

    if (hasRecording) recordings++;
  });

  const avgSeconds = connected > 0 ? Math.floor(totalDuration / connected) : 0;
  const avgMins = Math.floor(avgSeconds / 60);
  const avgSecsRemainder = avgSeconds % 60;
  const averageDuration = `${avgMins}m ${avgSecsRemainder}s`;

  const connectionRate = Math.round((connected / calls.length) * 100) + "%";

  const longestMins = Math.floor(maxDuration / 60);
  const longestSecs = maxDuration % 60;
  const longestCall = `${longestMins}m ${longestSecs}s`;

  return {
    totalCalls: calls.length,
    connectedCalls: connected,
    missedCalls: missed,
    busyCalls: busy,
    averageDuration,
    recordings,
    connectionRate,
    longestCall
  };
}
