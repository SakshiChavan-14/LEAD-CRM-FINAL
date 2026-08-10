/**
 * Ranks search results based on Sprint 19 Entity Ranking Weights.
 * 
 * @param {Array} results - The items to sort
 * @param {string} query - The search query
 * @returns {Array} Sorted results
 */
export function rankSearchResults(results, query) {
  if (!query || !results) return results || [];
  const q = query.toLowerCase().trim();

  return [...results].sort((a, b) => {
    const scoreA = getScore(a, q);
    const scoreB = getScore(b, q);
    
    // Sort descending by score
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }
    
    // Fallback to recency if updatedAt exists
    if (a.updatedAt && b.updatedAt) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    
    return 0;
  });
}

/**
 * Calculates a relevance score for an item based on the search query.
 */
function getScore(item, q) {
  let score = 0;
  
  // Exact Lead / Employee ID (Weight: 50)
  if (item.id && String(item.id).toLowerCase() === q) score += 50;
  else if (item.employeeId && String(item.employeeId).toLowerCase() === q) score += 50;
  
  // Name Exact Match (Weight: 40)
  if (item.name && item.name.toLowerCase() === q) score += 40;
  // Name Starts With (Weight: 30)
  else if (item.name && item.name.toLowerCase().startsWith(q)) score += 30;
  // Name Contains (Weight: 20)
  else if (item.name && item.name.toLowerCase().includes(q)) score += 20;

  // Phone Exact (Weight: 35)
  if (item.phone && String(item.phone).includes(q)) score += 35;
  // Phone Contains (Weight: 25)
  else if (item.phone && String(item.phone).includes(q)) score += 25;
  
  // Email (Weight: 30)
  if (item.email && item.email.toLowerCase().includes(q)) score += 30;

  // Company (Weight: 15)
  if (item.company && item.company.toLowerCase().includes(q)) score += 15;

  // Remarks (Weight: 5)
  if (item.remarks && item.remarks.toLowerCase().includes(q)) score += 5;

  return score;
}
