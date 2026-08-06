export default function Textarea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
  error,
  className = "",
  ...props
}) {
  const errorId = name ? `${name}-error` : undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="block text-label font-semibold text-gray-700 font-sans"
        >
          {label}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        rows={rows}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`
          w-full
          rounded-[var(--radius-control)]
          border
          px-[var(--spacing-card)]
          py-3
          text-body
          font-sans
          outline-none
          resize-none
          transition-all
          duration-200
          ${
            error
              ? "border-red-400"
              : "border-gray-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-yellow-100"
          }
          ${className}
        `}
        {...props}
      />

      <div id={errorId} className="min-h-[20px] text-caption text-red-500 font-sans">
        {error}
      </div>
    </div>
  );
}