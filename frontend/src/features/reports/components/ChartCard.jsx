

export default function ChartCard({
  title,
  subtitle,
  children,
  isLoading,
  action,
  className = "",
  skeletonHeight = "300px"
}) {
  return (
    <div className={`bg-white rounded-3xl border border-slate-200/85 shadow-xs hover:shadow-lg hover:border-blue-250 hover:scale-[1.01] transition-all duration-300 p-6 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 w-full h-full relative">
        {isLoading ? (
          <div 
            className="w-full bg-slate-100 animate-pulse rounded-xl"
            style={{ height: skeletonHeight }}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
