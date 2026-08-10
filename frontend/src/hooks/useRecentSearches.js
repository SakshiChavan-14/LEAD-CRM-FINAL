import { useState, useEffect } from 'react';

const RECENT_SEARCHES_KEY = 'crm_recent_searches';
const MAX_RECENT = 5;
const EXPIRY_DAYS = 30;

export function useRecentSearches(userId) {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (!userId) return;
    try {
      const stored = localStorage.getItem(`${RECENT_SEARCHES_KEY}_${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        const valid = parsed.filter(item => (now - item.timestamp) < EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        setRecentSearches(valid.map(i => i.query));
      }
    } catch (e) {
      console.warn("Failed to load recent searches", e);
    }
  }, [userId]);

  const addSearch = (query) => {
    if (!query || !query.trim() || !userId) return;
    
    const q = query.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== q.toLowerCase());
      const updated = [q, ...filtered].slice(0, MAX_RECENT);
      
      try {
        const toStore = updated.map(item => ({ query: item, timestamp: Date.now() }));
        localStorage.setItem(`${RECENT_SEARCHES_KEY}_${userId}`, JSON.stringify(toStore));
      } catch (e) {
        console.warn("Failed to save recent search", e);
      }
      
      return updated;
    });
  };

  const clearRecent = () => {
    setRecentSearches([]);
    if (userId) {
      localStorage.removeItem(`${RECENT_SEARCHES_KEY}_${userId}`);
    }
  };

  return { recentSearches, addSearch, clearRecent };
}
