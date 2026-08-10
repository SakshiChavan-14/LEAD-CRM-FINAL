import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

/**
 * A standard, reusable SearchBar component across the CRM.
 * Integrates with `useSearchController`.
 * 
 * @param {Object} props
 * @param {Object} props.controller - The return value from useSearchController hook
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.className] - Additional wrapper classes
 * @param {boolean} [props.loading] - External loading state (e.g. from React Query isFetching)
 * @param {boolean} [props.autoFocus] - Auto focus the input
 */
export const SearchBar = React.forwardRef(({
  controller,
  placeholder = "Search...",
  className = "",
  loading = false,
  autoFocus = false,
  ...props
}, ref) => {
  const { search, setSearch, clear, isSearching, hasValue } = controller || {};

  const showLoading = isSearching || loading;

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search 
        size={18} 
        className="absolute left-3.5 text-gray-400 pointer-events-none" 
      />
      
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={search || ''}
        onChange={(e) => setSearch && setSearch(e.target.value)}
        autoFocus={autoFocus}
        className="
          w-full 
          pl-10 
          pr-10 
          py-2 
          bg-gray-50 
          border 
          border-gray-200 
          rounded-xl 
          text-sm 
          placeholder:text-gray-500 
          focus:bg-white 
          focus-ring 
          transition-all
        "
        {...props}
      />

      <div className="absolute right-3.5 flex items-center gap-1.5">
        {showLoading && (
          <Loader2 size={16} className="animate-spin text-brand-600" />
        )}
        
        {!showLoading && hasValue && (
          <button
            type="button"
            onClick={() => clear && clear()}
            className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none focus-ring rounded-full p-0.5"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
