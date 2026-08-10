import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(' ');

export const KpiCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-[16px] p-5 flex flex-col min-h-[116px] w-full relative">
    <div className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-gray-100 animate-pulse"></div>
    <div className="w-16 h-8 bg-gray-100 animate-pulse rounded mb-2"></div>
    <div className="w-24 h-4 bg-gray-100 animate-pulse rounded"></div>
  </div>
);

export { KpiCardSkeleton as KPICardSkeleton };

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  variant = "neutral", // primary, success, warning, danger, info, neutral
  iconClassName,
  iconBgClassName,
  trend,
  trendDirection = "neutral", // "up", "down", "neutral"
  loading = false,
  onClick,
  className = "",
  href
}) {
  if (loading) return <KpiCardSkeleton />;

  const Icon = icon;

  // Display '0' or '—' for empty/invalid values
  const displayValue = (value === undefined || value === null || Number.isNaN(value)) ? "0" : value;

  const getVariantStyles = () => {
    if (iconClassName || iconBgClassName) {
      return `${iconBgClassName || ''} ${iconClassName || ''}`;
    }
    switch (variant) {
      case "primary": return "text-[#8B1538] bg-[#8B1538]/10";
      case "success": return "text-[#16A34A] bg-[#16A34A]/10";
      case "warning": return "text-[#F59E0B] bg-[#F59E0B]/10";
      case "danger": return "text-[#EF4444] bg-[#EF4444]/10";
      case "info": return "text-[#2563EB] bg-[#2563EB]/10";
      case "neutral":
      default: return "text-[#64748B] bg-[#F1F5F9]";
    }
  };

  const renderTrend = () => {
    let trendColors = "text-[#16A34A]";
    
    if (trendDirection === "down") {
      trendColors = "text-[#EF4444]";
    } else if (trendDirection === "neutral") {
      trendColors = "text-[#64748B]";
    }

    return (
      <div className={`text-[12px] font-medium mt-auto ${trendColors}`}>
        {trend}
      </div>
    );
  };

  const CardContent = (
    <div
      className={`relative bg-white border border-gray-200 rounded-[16px] p-5 flex flex-col min-h-[116px] flex-1 w-full transition-all duration-300 ease-out group 
      ${(onClick || href) ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-sm' : ''} ${className}`}
      onClick={onClick}
    >
      {/* 1. Top-Right Icon */}
      {Icon && (
        <div className={`absolute top-5 right-5 flex items-center justify-center w-10 h-10 rounded-xl transition-transform duration-300 group-hover:scale-105 ${getVariantStyles()}`}>
          <Icon className={cn('h-6 w-6', iconClassName)} />
        </div>
      )}

      {/* 2. KPI Value (Left Aligned) */}
      <p className="text-[32px] font-bold text-gray-900 leading-none mb-1.5 truncate pr-12 shrink-0">
        {displayValue}
      </p>

      {/* 3. KPI Title (Left Aligned) */}
      <h3 className="text-[13px] font-medium text-gray-500 leading-tight truncate pr-12 shrink-0">
        {title}
      </h3>

      {/* 4. Subtitle / Trend (Bottom-Left) */}
      {(trend || subtitle) && (
        <div className="mt-auto">
          {subtitle && !trend && <span className="text-[12px] text-gray-400">{subtitle}</span>}
          {trend && renderTrend()}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block w-full outline-none focus:ring-2 focus:ring-[#8B1538] rounded-[16px]">{CardContent}</Link>;
  }

  return CardContent;
}

export { KpiCard as KPICard };
export default KpiCard;
