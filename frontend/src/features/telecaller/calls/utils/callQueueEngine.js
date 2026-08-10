export function createCallQueueModel(leads = [], followups = [], calls = []) {
  const todayStr = new Date().toISOString().split("T")[0];

  const queueItemsMap = new Map();

  // Add followups
  followups.forEach((f) => {
    if (f.status === "Completed") return;

    const isOverdue = f.status === "Missed" || (f.status === "Pending" && f.scheduledDate < todayStr);
    const isToday = f.scheduledDate === todayStr;

    if (!isOverdue && !isToday && f.scheduledDate > todayStr) return; // Future followup

    let priorityScore = isOverdue ? 100 : 90; 
    let reason = isOverdue ? "Overdue Follow-up" : "Pending Follow-up";
    let priorityType = isOverdue ? "Overdue" : "Pending";

    const id = f.leadId || f.id;

    if (queueItemsMap.has(id)) {
      if (queueItemsMap.get(id).priorityScore >= priorityScore) return;
    }

    queueItemsMap.set(id, {
      id,
      name: f.name || "Unknown",
      course: f.course || "--",
      phone: f.phone || "--",
      status: f.status,
      assignedTime: f.createdAt || f.scheduledDate,
      reason,
      priorityType,
      priorityScore,
      createdAtDate: new Date(f.createdAt || f.scheduledDate || 0),
    });
  });

  // Add leads
  leads.forEach((l) => {
    const id = l.id || l.enquiryNo;
    if (queueItemsMap.has(id)) return;

    const status = String(l.status || "").toUpperCase();
    if (["ENROLLED", "CONVERTED", "CLOSED", "NOT_INTERESTED", "NOT INTERESTED", "LOST"].includes(status)) return;

    let priorityScore = 0;
    let reason = "Assigned Lead";
    let priorityType = "Normal";

    const temperature = (l.temperature || "").toLowerCase();
    
    if (status === "NEW") {
      priorityScore = 40;
      reason = "Newly Assigned";
      priorityType = "New";
    } else if (temperature === "hot") {
      priorityScore = 80;
      reason = "Hot Lead";
      priorityType = "Hot";
    } else if (temperature === "warm") {
      priorityScore = 60;
      reason = "Warm Lead";
      priorityType = "Warm";
    } else if (temperature === "cold") {
      priorityScore = 20;
      reason = "Cold Lead";
      priorityType = "Cold";
    } else {
      priorityScore = 10;
      priorityType = "Pending";
    }

    queueItemsMap.set(id, {
      id,
      name: l.name || "Unknown",
      course: l.course || "--",
      phone: l.phone || "--",
      status: l.status || "NEW",
      assignedTime: l.assignedAt || l.createdAt,
      reason,
      priorityType,
      priorityScore,
      createdAtDate: new Date(l.assignedAt || l.createdAt || 0),
    });
  });

  const queueItems = Array.from(queueItemsMap.values());

  // Sort by priorityScore DESC, then createdAtDate ASC
  queueItems.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    return a.createdAtDate - b.createdAtDate;
  });

  const recommendedLead = queueItems.length > 0 ? queueItems[0] : null;
  const queue = queueItems.slice(1);

  // Compute Summary
  const pendingFollowups = followups.filter((f) => f.status === "Pending" && f.scheduledDate >= todayStr).length;
  const overdueCalls = followups.filter((f) => f.status === "Missed" || (f.status === "Pending" && f.scheduledDate < todayStr)).length;
  
  const callsToday = calls.filter(c => {
    const callDate = new Date(c.callDateTime || c.createdAt || c.date).toISOString().split("T")[0];
    return callDate === todayStr;
  }).length;

  const totalAssigned = leads.filter(l => {
    const s = String(l.status || "").toUpperCase();
    return !["ENROLLED", "CONVERTED", "CLOSED", "NOT_INTERESTED", "NOT INTERESTED", "LOST"].includes(s);
  }).length;

  const summary = {
    assignedLeads: totalAssigned,
    pendingFollowups,
    overdueCalls,
    completedToday: callsToday,
  };

  // Compute Progress
  let completionPercent = 0;
  if (totalAssigned > 0) {
    completionPercent = Math.min(100, Math.round((callsToday / totalAssigned) * 100));
  } else if (callsToday > 0) {
    completionPercent = 100;
  }

  const progress = {
    callsMadeToday: callsToday,
    assignedLeads: totalAssigned,
    completionPercent,
  };

  return {
    summary,
    recommendedLead,
    queue,
    progress,
  };
}
