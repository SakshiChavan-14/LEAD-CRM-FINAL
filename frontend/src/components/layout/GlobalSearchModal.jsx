import React, { useEffect, useRef, useState } from "react";
import { Search, X, Loader2, History } from "lucide-react";
import { useSearchController } from "@/hooks/useSearchController";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import useAuthStore from "@/store/authStore";
import { rankSearchResults } from "@/utils/searchRanking";

/**
 * Global Search Modal (Client Aggregation Mode - Phase 1)
 * This modal acts as the UI shell and implements the search state machine,
 * recent searches, and result ranking pending a unified backend global search endpoint.
 */
export default function GlobalSearchModal({ isOpen, onClose }) {
  const { user } = useAuthStore();
  const { recentSearches, addSearch } = useRecentSearches(user?.id);
  const inputRef = useRef(null);

  const searchController = useSearchController({
    syncUrl: false,
    delay: 300,
  });

  const { search, debouncedSearch, setSearch, clear, isSearching, hasValue } = searchController;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Focus management and cleanup
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      clear();
      setResults([]);
    }
  }, [isOpen, clear]);

  // Global ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Client Aggregation Mock (To be replaced with actual parallel API calls)
  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    const fetchAggregation = async () => {
      setLoading(true);
      try {
        // Phase 2: Implement Promise.all with leadService, userService, etc.
        // For now, simulating API latency and structure
        await new Promise(res => setTimeout(res, 400));
        
        const mockResults = [
          { id: 'LD-101', name: debouncedSearch + " (Lead Mock)", type: "Lead", phone: "9876543210" },
        ];
        
        const ranked = rankSearchResults(mockResults, debouncedSearch);
        setResults(ranked);
        addSearch(debouncedSearch);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAggregation();
  }, [debouncedSearch, addSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden ring-1 ring-gray-200 mx-4">
        
        {/* Search Input Area */}
        <div className="relative flex items-center border-b border-gray-100 px-4">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent px-4 py-4 text-gray-900 placeholder:text-gray-500 focus:outline-none text-lg"
            placeholder="Search anything... (Leads, Users, Phones)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2">
            {(isSearching || loading) && (
              <Loader2 size={20} className="animate-spin text-brand-600" />
            )}
            {hasValue && !isSearching && !loading && (
              <button onClick={clear} className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus-ring">
                <X size={20} />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {/* Empty State / Recent Searches */}
          {!hasValue && recentSearches.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                Recent Searches
              </h3>
              <ul className="space-y-1">
                {recentSearches.map((term, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => setSearch(term)}
                      className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <History size={16} className="text-gray-400" />
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No Results */}
          {hasValue && !loading && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No results found for "{search}"
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                Results
              </h3>
              <ul className="space-y-1">
                {results.map((item, idx) => (
                  <li key={idx} className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.phone && <div className="text-xs text-gray-500">{item.phone}</div>}
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{item.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
