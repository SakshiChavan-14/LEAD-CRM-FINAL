export const mapLeadToViewModel = (rawLead) => {
  console.log("🧩 [MAPPER] Received raw data keys:", rawLead ? Object.keys(rawLead) : "null");
  console.log("🧩 [MAPPER] Raw data snapshot:", JSON.stringify(rawLead, null, 2)?.substring(0, 2000));
  if (!rawLead) return null;

  // The API /api/leads/{id} returns data in a nested format:
  // { student: { name, mobile, email, ... }, lead: { enquiryNo, status, source, assignedTo, ... }, education: {...}, location: {...}, ... }
  // We need to extract from nested first, then fall back to flat keys

  return {
    header: {
      name: rawLead?.student?.name || rawLead?.name || rawLead?.studentName || "Unknown",
      course: rawLead?.education?.course || rawLead?.education?.programme || rawLead?.course || rawLead?.programme || "Not specified",
      priority: rawLead?.lead?.temperature || rawLead?.priority || rawLead?.temperature || null, 
    },
    status: {
      currentStatus: rawLead?.lead?.status || rawLead?.status || "N/A",
      stage: rawLead?.lead?.stage || rawLead?.stage || "N/A", 
      readOnly: rawLead?.readOnly || false, 
      score: rawLead?.score || null, 
    },
    contact: {
      mobile: rawLead?.student?.mobile || rawLead?.mobileNo || rawLead?.mobile || "N/A",
      email: rawLead?.student?.email || rawLead?.email || "N/A",
      locationStr: [rawLead?.location?.city, rawLead?.location?.district, rawLead?.location?.state].filter(Boolean).join(", ") 
        || [rawLead?.city, rawLead?.district, rawLead?.state].filter(Boolean).join(", ") 
        || "N/A",
      state: rawLead?.location?.state || rawLead?.state || "N/A",
      district: rawLead?.location?.district || rawLead?.district || "N/A",
      taluk: rawLead?.location?.city || rawLead?.taluk || "N/A",
    },
    lead: {
      source: rawLead?.lead?.source || rawLead?.source || "N/A",
      opinion: rawLead?.lead?.temperature || rawLead?.opinion || "N/A",
      programme: rawLead?.education?.programme || rawLead?.programme || "N/A",
      discipline: rawLead?.education?.discipline || rawLead?.discipline || "N/A",
      college: rawLead?.education?.college || rawLead?.collegeStudied || "N/A",
    },
    assignment: {
      telecaller: rawLead?.lead?.assignedTo?.name || rawLead?.telecallerName || rawLead?.assignee || "Unassigned", 
      assignee: rawLead?.lead?.assignedTo?.name || rawLead?.assignee || rawLead?.telecallerName || "Unassigned", 
      phone: rawLead?.lead?.assignedTo?.mobile || rawLead?.lead?.assignedTo?.phone || rawLead?.telecallerPhone || "",
      email: rawLead?.lead?.assignedTo?.email || rawLead?.telecallerEmail || "",
      assignedDate: rawLead?.lead?.assignedAt || rawLead?.assignedDate || "N/A",
      assignedBy: rawLead?.lead?.assignedBy?.name || rawLead?.assignedBy || "System",
      status: "ACTIVE"
    },
    admin: {
      remarks: rawLead?.remarks || "No remarks available.",
      createdBy: rawLead?.createdBy || "System", 
    },
    timeline: [],
    notes: [],
  };
};
