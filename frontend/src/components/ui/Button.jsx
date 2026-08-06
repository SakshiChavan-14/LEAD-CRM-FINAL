export default function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  fullWidth = true,
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  className = "",
  ...props
}) {
  const variants = {
    primary: `
      bg-gradient-to-r
      from-[var(--gold)]
      to-[#E8BF67]
      text-[var(--primary)]
      hover:-translate-y-0.5
      hover:shadow-[var(--shadow-md)]
    `,
    secondary: `
      border
      border-gray-300
      bg-white
      text-gray-700
      hover:bg-gray-50
    `,
    danger: `
      bg-red-600
      text-white
      hover:bg-red-700
    `,
    maroon: `
      bg-[var(--gmu-maroon)]
      text-white
      hover:bg-[#4a0808]
      shadow-[var(--shadow-md)]
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-[var(--radius-control)]
        px-[var(--spacing-card)]
        py-2.5
        text-label
        font-semibold
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${fullWidth ? "w-full" : ""}
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}