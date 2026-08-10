import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

/**
 * A standard, reusable SearchBar component across the CRM.
 * Supports both `controller` (from useSearchController) and standard `value` / `onChange` props.
 */
export const SearchBar = React.forwardRef(({
  controller,
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  loading = false,
  autoFocus = false,
  ...props
}, ref) => {
  const isControlledDirectly = value !== undefined || onChange !== undefined;
  
  const searchValue = isControlledDirectly ? (value ?? '') : (controller?.search ?? '');
  const showLoading = controller?.isSearching || loading;
  const hasVal = Boolean(searchValue);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    } else if (controller?.setSearch) {
      controller.setSearch(e.target.value);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    } else if (controller?.clear) {
      controller.clear();
    }
  };

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
        value={searchValue}
        onChange={handleChange}
        autoFocus={autoFocus}
        className="
          w-full 
          pl-10 
          pr-10 
          py-2.5 
          bg-gray-50 
          border 
          border-gray-200 
          rounded-xl 
          text-sm 
          placeholder:text-gray-400 
          focus:bg-white 
          focus:border-[var(--primary,#7A1F2B)]
          focus:ring-2
          focus:ring-[var(--primary,#7A1F2B)]/10
          outline-none
          transition-all
        "
        {...props}
      />

      <div className="absolute right-3.5 flex items-center gap-1.5">
        {showLoading && (
          <Loader2 size={16} className="animate-spin text-gray-400" />
        )}
        
        {!showLoading && hasVal && (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none rounded-full p-0.5"
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
export default SearchBar;

