export default function Input({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    required = false,
    disabled = false,
    icon,
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
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-required={required}
                    aria-describedby={error ? errorId : undefined}
                    className={`
                        w-full
                        rounded-[var(--radius-control)]
                        border
                        ${icon ? "pl-11 pr-[var(--spacing-card)]" : "px-[var(--spacing-card)]"}
                        py-3
                        text-body
                        placeholder:text-gray-400
                        outline-none
                        transition-all
                        duration-200
                        font-sans
                        ${
                            error
                                ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                : "border-gray-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-yellow-100"
                        }
                        ${className}
                    `}
                />
            </div>

            <div className="min-h-[20px] text-caption text-red-500 font-sans">
                {error && <p id={errorId}>{error}</p>}
            </div>
        </div>
    );
}