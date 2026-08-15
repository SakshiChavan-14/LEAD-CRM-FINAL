const parseDurationToSeconds = (v) => {
  if (v === undefined || v === null || v === "") return 0;
  if (typeof v === "number") return v;
  
  const str = String(v).trim();
  if (!str.includes(":")) {
    const num = Number(str);
    return isNaN(num) ? 0 : num;
  }
  
  const parts = str.split(":").map(Number);
  if (parts.some(isNaN)) return 0;
  
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
};

export function calculateCallMetrics(calls = []) {
  if (!calls || calls.length === 0) {
    return {
      totalCalls: 0,
      connectedCalls: 0,
      missedCalls: 0,
      busyCalls: 0,
      averageDuration: "0m 0s",
      recordings: 0,
      connectionRate: "0%",
      longestCall: "0m 0s"
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
    const normalizedOutcome = String(outcome).toUpperCase();
    const duration = parseDurationToSeconds(call.callDurationSeconds || call.callDuration || call.duration || 0);
    const hasRecording = call.recordingUrl && call.recordingUrl.trim() !== "";

    totalDuration += duration;
    
    if (duration > maxDuration) {
      maxDuration = duration;
    }

    if (normalizedOutcome === "CONNECTED") {
      connected++;
    } else if (
      normalizedOutcome === "NO ANSWER" || 
      normalizedOutcome === "MISSED" || 
      normalizedOutcome === "FAILED" || 
      normalizedOutcome === "NO_ANSWER"
    ) {
      missed++;
    } else if (normalizedOutcome === "BUSY") {
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

