const resolveName = (...names) => {
  for (const name of names) {
    if (name && typeof name === 'string' && name.trim().length > 0) {
      return name.trim();
    }
  }
  return "Unknown";
};

export const mapDashboard = (rawData) => {
  if (!rawData) return null;

  return {
    summary: rawData.summary || {
      assigned: 0,
      callsToday: 0,
      connected: 0,
      interested: 0,
      admissions: 0,
      goal: 0
    },
    nextCalls: Array.isArray(rawData.nextCalls) ? rawData.nextCalls : [],
    todaysFocus: rawData.todaysFocus || {
      highPriority: 0,
      overdueFollowups: 0,
      callsRemaining: 0,
      nearConversion: 0
    },
    pipeline: Array.isArray(rawData.pipeline) ? rawData.pipeline : [],
    analytics: Array.isArray(rawData.analytics) ? rawData.analytics : [],
    weeklyPerformance: rawData.weeklyPerformance || {
      calls: { current: 0, target: 1 },
      interested: { current: 0, target: 1 },
      admissions: { current: 0, target: 1 }
    },
    activities: Array.isArray(rawData.activities) ? rawData.activities : [],
    leads: Array.isArray(rawData.leads) ? rawData.leads : [],
    followups: Array.isArray(rawData.followups) ? rawData.followups : [],
  };
};

export const mapLeadOverview = (rawLead) => {
  if (!rawLead) return null;
  return {
    ...rawLead,
    enquiryNo: rawLead.enquiryNo ?? rawLead.id,
    name: resolveName(rawLead.studentName, rawLead.name, rawLead.student?.name, rawLead.fullName),
    mobileNo: rawLead.mobileNo || rawLead.phone || "N/A",
    course: rawLead.course || "N/A",
    status: rawLead.status || "N/A",
    opinion: rawLead.opinion || "N/A",
    state: rawLead.state || "N/A",
    district: rawLead.district || "N/A",
    source: rawLead.source || "N/A",
    callCount: rawLead.callCount ?? 0,
  };
};

export const mapLeadDetail = (rawLead) => {
  if (!rawLead) return null;
  
  // Resolve assigned telecaller comprehensively from nested or flat fields
  const assignedTo = rawLead?.lead?.assignedTo || rawLead?.assignedTo || rawLead?.assignment?.telecaller || rawLead?.assignment?.assignee || rawLead?.telecallerName || rawLead?.callerName || rawLead?.assignee;
  const telecallerName = typeof assignedTo === "object" && assignedTo !== null 
    ? (assignedTo.name || assignedTo.fullName || assignedTo.username || assignedTo.empName || "Unassigned")
    : (typeof assignedTo === "string" && assignedTo.trim() !== "" ? assignedTo.trim() : "Unassigned");

  const telecallerPhone = rawLead?.lead?.assignedTo?.mobile || rawLead?.lead?.assignedTo?.phone || rawLead?.assignedTo?.phone || rawLead?.assignedTo?.mobile || rawLead?.telecallerPhone || rawLead?.assignment?.phone || "";
  const telecallerEmail = rawLead?.lead?.assignedTo?.email || rawLead?.assignedTo?.email || rawLead?.telecallerEmail || rawLead?.assignment?.email || "";
  const assignedDate = rawLead?.lead?.assignedAt || rawLead?.assignedDate || rawLead?.assignment?.assignedDate || "N/A";
  const assignedBy = rawLead?.lead?.assignedBy?.name || rawLead?.lead?.assignedBy || rawLead?.assignedBy || rawLead?.assignment?.assignedBy || "System";

  // Reuse structure expected by existing admin Lead Detail page where applicable
  const mapped = {
    header: {
      name: resolveName(rawLead.student?.name, rawLead.studentName, rawLead.name, rawLead.fullName),
      course: rawLead.education?.course || rawLead.education?.programme || rawLead.course || rawLead.programme || "N/A",
      priority: rawLead.lead?.temperature || rawLead.temperature || rawLead.priority || null,
    },
    status: {
      currentStatus: rawLead.lead?.status || rawLead.status || "N/A",
      stage: rawLead.lead?.stage || rawLead.stage || "N/A",
      readOnly: true, // Telecallers usually have read-only access to core details
    },
    contact: {
      mobile: rawLead.student?.mobile || rawLead.mobileNo || rawLead.mobile || rawLead.phone || "N/A",
      email: rawLead.student?.email || rawLead.email || "N/A",
      locationStr: [rawLead.location?.city || rawLead.city, rawLead.location?.district || rawLead.district, rawLead.location?.state || rawLead.state].filter(Boolean).join(", ") || "N/A",
      state: rawLead.location?.state || rawLead.state || "N/A",
      district: rawLead.location?.district || rawLead.district || "N/A",
      taluk: rawLead.location?.city || rawLead.city || rawLead.taluk || "N/A",
    },
    lead: {
      source: rawLead.lead?.source || rawLead.source || "N/A",
      opinion: rawLead.lead?.temperature || rawLead.opinion || "N/A",
      programme: rawLead.education?.programme || rawLead.programme || "N/A",
      discipline: rawLead.education?.discipline || rawLead.discipline || "N/A",
      college: rawLead.education?.college || rawLead.collegeStudied || "N/A",
    },
    assignment: {
      telecaller: telecallerName,
      assignee: telecallerName,
      phone: telecallerPhone,
      email: telecallerEmail,
      assignedDate: assignedDate,
      assignedBy: assignedBy,
      status: "ACTIVE"
    },
    timeline: Array.isArray(rawLead.timeline) ? rawLead.timeline : [],
    notes: Array.isArray(rawLead.notes) ? rawLead.notes : [],
  };

  return {
    ...mapped,
    rawData: rawLead,
  };
};

export const mapFollowup = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id || raw.followupId || raw.enquiryNo,
    leadId: raw.leadId || raw.enquiryNo || raw.id,
    enquiryNo: raw.enquiryNo || raw.leadId || raw.id,
    name: resolveName(raw.studentName, raw.student?.name, raw.student, raw.leadName, raw.name, raw.fullName),
    phone: raw.mobileNo || raw.phone || raw.mobile || raw.student?.mobile || "N/A",
    course: raw.course || raw.programme || raw.education?.course || "N/A",
    priority: raw.priority
      ? raw.priority.charAt(0).toUpperCase() + raw.priority.slice(1).toLowerCase()
      : null,
    scheduledDate: raw.scheduledDate || raw.date,
    scheduledTime: raw.scheduledTime || raw.time,
    status: raw.status || raw.leadStatus || raw.stage || "PENDING",
    remarks: raw.nextAction || raw.remarks || raw.notes || "",
    createdAt: raw.createdAt,
  };
};
