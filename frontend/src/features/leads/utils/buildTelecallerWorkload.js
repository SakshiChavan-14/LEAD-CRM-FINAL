/**
 * TEMPORARY WORKAROUND — Sprint 22.2
 * 
 * Primary Matching: ID-based matching (empId, id, telecallerId, assignedToId).
 * Fallback Matching: Normalized name matching (callerName === name).
 * 
 * REMOVE THIS FALLBACK & ENTIRE FILE once GET /api/leads/manager/users
 * returns assignedLeadCount directly from the backend.
 * 
 * Do NOT extend this helper for other features.
 * Backend workload should become the single source of truth.
 */

// Lifecycle states considered closed/inactive (not counting toward workload)
const CLOSED_STATUSES = new Set([
  "CONVERTED",
  "CLOSED",
  "NOT_INTERESTED",
  "NOT INTERESTED",
  "COMPLETED",
  "ARCHIVED",
  "DELETED",
  "CANCELLED",
  "LOST"
]);

/**
 * Normalizes name strings for accurate fallback comparison
 * Trims whitespace, converts to lowercase, collapses multiple spaces
 */
const normalizeName = (name) => {
  if (typeof name !== "string" || !name) return "";
  return name.trim().toLowerCase().replace(/\s+/g, " ");
};

/**
 * Extracts assigned telecaller identifier (ID or normalized name fallback) from a lead object
 */
const getAssignedTelecallerRef = (lead) => {
  if (!lead) return null;

  // 1. Primary Strategy: ID-based matching
  if (lead?.lead?.assignedTo) {
    const at = lead.lead.assignedTo;
    const id = at?.empId || at?.id || at?.userId;
    if (id) return { type: "id", value: String(id).trim() };
  }
  if (lead?.assignedTo && typeof lead.assignedTo === "object") {
    const id = lead.assignedTo?.empId || lead.assignedTo?.id || lead.assignedTo?.userId;
    if (id) return { type: "id", value: String(id).trim() };
  }

  const flatId =
    lead?.assignedToEmpId ||
    lead?.telecallerEmpId ||
    lead?.assignedToId ||
    lead?.telecallerId ||
    (typeof lead?.assignedTo === "string" || typeof lead?.assignedTo === "number" ? lead.assignedTo : null);

  if (flatId) return { type: "id", value: String(flatId).trim() };

  // 2. Fallback Strategy: Normalized Name matching
  const rawName = lead?.callerName || lead?.telecallerName || lead?.assignee || lead?.lead?.assignedTo?.name;
  const normName = normalizeName(rawName);

  if (normName && normName !== "unassigned") {
    return { type: "name", value: normName };
  }

  return null;
};

/**
 * Aggregates workload counts from complete lead dataset and attaches badges & sorting
 * 
 * @param {Array} telecallers - Raw telecaller list from useUsers()
 * @param {Array} allLeads - Complete lead dataset from useAllLeadsForWorkload()
 * @returns {Array} Enriched and sorted telecallers array
 */
export function buildTelecallerWorkload(telecallers = [], allLeads = []) {
  if (!Array.isArray(telecallers)) return [];

  // Detect duplicate telecaller names and emit a warning
  const nameCounts = new Map();
  telecallers.forEach((tc) => {
    const norm = normalizeName(tc.name);
    if (norm) {
      nameCounts.set(norm, (nameCounts.get(norm) || 0) + 1);
    }
  });

  const duplicateNames = Array.from(nameCounts.entries())
    .filter(([_, count]) => count > 1)
    .map(([name]) => name);

  if (duplicateNames.length > 0) {
    console.warn(
      `⚠️ [WORKLOAD TEMPORARY FALLBACK WARNING] Duplicate telecaller names detected: ${duplicateNames.join(", ")}. Name-based workload fallback may become ambiguous for these users until backend telecaller IDs are exposed on overview leads.`
    );
  }

  // Step 1: Tally workloads by ID and Normalized Name
  const idWorkloadMap = new Map();
  const nameWorkloadMap = new Map();

  if (Array.isArray(allLeads) && allLeads.length > 0) {
    for (const lead of allLeads) {
      // Exclude non-active / closed leads
      const status = String(lead?.status || lead?.lead?.status || "").toUpperCase();
      if (CLOSED_STATUSES.has(status)) continue;

      const ref = getAssignedTelecallerRef(lead);
      if (!ref) continue;

      if (ref.type === "id") {
        idWorkloadMap.set(ref.value, (idWorkloadMap.get(ref.value) || 0) + 1);
      } else if (ref.type === "name") {
        nameWorkloadMap.set(ref.value, (nameWorkloadMap.get(ref.value) || 0) + 1);
      }
    }
  }

  // Step 2: Enrich telecaller objects with assignedLeadCount & badge metadata
  const enriched = telecallers.map((tc) => {
    const idKeys = [tc.empId, tc.id, tc.slNo, tc.userId].filter(Boolean).map((v) => String(v).trim());
    const normName = normalizeName(tc.name);

    let count = 0;

    // Check ID match first
    for (const key of idKeys) {
      if (idWorkloadMap.has(key)) {
        count = idWorkloadMap.get(key);
        break;
      }
    }

    // Fall back to normalized Name match if ID match gave 0
    if (count === 0 && normName && nameWorkloadMap.has(normName)) {
      count = nameWorkloadMap.get(normName);
    }

    // Determine visual workload badge category
    let badgeVariant = "low"; // 0-10 Green
    let badgeLabel = "Low Workload";
    let badgeColor = "bg-emerald-50 text-emerald-700 border border-emerald-200";

    if (count > 40) {
      badgeVariant = "heavy"; // 40+ Red
      badgeLabel = "Heavy Workload";
      badgeColor = "bg-rose-50 text-rose-700 border border-rose-200";
    } else if (count >= 26) {
      badgeVariant = "busy"; // 26-40 Orange
      badgeLabel = "Busy";
      badgeColor = "bg-orange-50 text-orange-700 border border-orange-200";
    } else if (count >= 11) {
      badgeVariant = "moderate"; // 11-25 Yellow
      badgeLabel = "Moderate";
      badgeColor = "bg-amber-50 text-amber-700 border border-amber-200";
    }

    return {
      ...tc,
      assignedLeadCount: count,
      workloadBadge: {
        variant: badgeVariant,
        label: badgeLabel,
        colorClass: badgeColor,
      },
    };
  });

  // Step 3: 4-Tier Intelligent Sorting Hierarchy
  return enriched.sort((a, b) => {
    const aAvailable = (a.status || "").toUpperCase() === "ACTIVE" || (a.status || "").toUpperCase() === "AVAILABLE";
    const bAvailable = (b.status || "").toUpperCase() === "ACTIVE" || (b.status || "").toUpperCase() === "AVAILABLE";

    // Tier 1: Available status first
    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;

    // Tier 2: Lowest assigned lead count (ascending)
    if (a.assignedLeadCount !== b.assignedLeadCount) {
      return a.assignedLeadCount - b.assignedLeadCount;
    }

    // Tier 3: Alphabetical name tie-breaker
    return (a.name || "").localeCompare(b.name || "");
  });
}
