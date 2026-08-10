"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

function parseAnimatedValue(val) {
  if (val === undefined || val === null || val === '') return { isAnimatable: false, value: "0" };
  const strVal = String(val).trim();

  if (["--", "-", "N/A", "Loading", "—"].includes(strVal)) {
    return { isAnimatable: false, value: strVal };
  }

  // Regex to extract prefix, number (with optional commas and decimals), suffix
  // e.g. "$12,000.50k" -> prefix "$", number "12,000.50", suffix "k"
  const match = strVal.match(/^([^0-9.-]*)(-?[0-9,]+(?:\.[0-9]+)?)(.*)$/);
  if (match) {
    const prefix = match[1];
    const numStr = match[2];
    const suffix = match[3];

    const hasCommas = numStr.includes(',');
    const cleanNumStr = numStr.replace(/,/g, '');
    const numericValue = parseFloat(cleanNumStr);

    if (!isNaN(numericValue)) {
      return {
        isAnimatable: true,
        numericValue,
        prefix,
        suffix,
        hasCommas,
        isInteger: !cleanNumStr.includes('.')
      };
    }
  }

  return { isAnimatable: false, value: strVal };
}

function useCountUp(value, duration = 1000) {
  const [displayValue, setDisplayValue] = useState(() => {
    const initialVal = (value === undefined || value === null || Number.isNaN(value)) ? "0" : value;
    // Don't animate on initial render to prevent SSR mismatch, let useEffect start it.
    // Wait, since this is "use client", it's fine. We return "0" initially if animatable so it counts up from 0.
    const parsed = parseAnimatedValue(initialVal);
    if (parsed.isAnimatable) {
      return `${parsed.prefix}0${parsed.isInteger ? '' : '.'.padEnd(String(parsed.numericValue).split('.')[1]?.length + 1 || 1, '0')}${parsed.suffix}`;
    }
    return parsed.value;
  });

  useEffect(() => {
    const parsed = parseAnimatedValue(value);
    const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

    if (!parsed.isAnimatable || prefersReducedMotion) {
      setDisplayValue(parsed.isAnimatable ? value : parsed.value);
      return;
    }

    let startTime = null;
    let animationFrameId = null;
    const target = parsed.numericValue;
    const decimals = String(target).split('.')[1]?.length || 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);

      const easeProgress = easeOutQuart(progressRatio);
      let currentVal = easeProgress * target;

      let formattedNum = parsed.isInteger
        ? Math.floor(currentVal).toString()
        : currentVal.toFixed(decimals);

      if (parsed.hasCommas) {
        const parts = formattedNum.split('.');
        parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
        formattedNum = parts.join('.');
      }

      setDisplayValue(`${parsed.prefix}${formattedNum}${parsed.suffix}`);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Ensure exact final string match
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  return displayValue;
}

export const DashboardOverviewKpiCardSkeleton = () => (
  <div className="relative overflow-hidden bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_32px_rgba(30,41,59,0.04)] rounded-[28px] px-7 pt-8 pb-6 flex flex-col items-center text-center h-full min-h-[220px] w-full">
    <div className="w-[60px] h-[44px] rounded-2xl bg-slate-100/80 animate-pulse mb-[20px] shrink-0"></div>
    <div className="w-24 h-8 bg-slate-100/80 animate-pulse rounded mb-[10px] shrink-0"></div>
    <div className="w-20 h-4 bg-slate-100/80 animate-pulse rounded mb-[6px] shrink-0"></div>
    <div className="w-32 h-3 bg-slate-100/80 animate-pulse rounded shrink-0"></div>
  </div>
);

export function DashboardOverviewKPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
  trendDirection = "neutral",
  loading = false,
  onClick,
  className = "",
  href
}) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  if (loading) return <DashboardOverviewKpiCardSkeleton />;

  const animatedDisplayValue = useCountUp(value, 1000);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getGlowColor = () => {
    switch (variant) {
      case "primary": return "bg-red-400";
      case "success": return "bg-emerald-400";
      case "warning":
      case "yellow": return "bg-yellow-400";
      case "danger": return "bg-rose-400";
      case "purple": return "bg-purple-400";
      case "info":
      case "blue": return "bg-blue-400";
      case "orange": return "bg-orange-400";
      case "cyan": return "bg-cyan-400";
      default: return "bg-gray-400";
    }
  };

  const getSemanticRGB = () => {
    switch (variant) {
      case "primary": return "239, 68, 68";
      case "success": return "34, 197, 94";
      case "warning":
      case "yellow": return "234, 179, 8";
      case "danger": return "225, 29, 72";
      case "purple": return "168, 85, 247";
      case "info":
      case "blue": return "59, 130, 246";
      case "orange": return "249, 115, 22";
      case "cyan": return "6, 182, 212";
      default: return "148, 163, 184";
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary": return "text-red-600";
      case "success": return "text-emerald-600";
      case "warning":
      case "yellow": return "text-yellow-600";
      case "danger": return "text-rose-600";
      case "purple": return "text-purple-600";
      case "info":
      case "blue": return "text-blue-600";
      case "orange": return "text-orange-600";
      case "cyan": return "text-cyan-600";
      default: return "text-gray-600";
    }
  };

  const renderTrend = () => {
    let TrendIcon = TrendingUp;
    let trendColors = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";

    if (trendDirection === "down") {
      TrendIcon = TrendingDown;
      trendColors = "text-rose-600 bg-rose-500/10 border-rose-500/20";
    } else if (trendDirection === "neutral") {
      TrendIcon = Minus;
      trendColors = "text-slate-500 bg-slate-100 border-slate-200";
    }

    return (
      <div className={`flex items-center justify-center gap-1.5 text-caption font-semibold font-sans mt-1 px-2.5 py-0.5 rounded-full border ${trendColors}`}>
        <TrendIcon size={14} strokeWidth={2.5} />
        <span>{trend}</span>
      </div>
    );
  };

  const CardContent = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_32px_rgba(30,41,59,0.04)] rounded-[28px] px-7 pt-8 pb-6 flex flex-col items-center text-center h-full min-h-[220px] w-full group z-0 
      transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none motion-reduce:transform-none
      ${(onClick || href) ? 'cursor-pointer hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_16px_48px_rgba(30,41,59,0.08)] hover:bg-white/95' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Radial Spotlight Effect */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-[500ms] motion-reduce:hidden"
        style={{
          background: `radial-gradient(250px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(${getSemanticRGB()}, 0.06), transparent 80%)`,
          opacity: isHovered ? 1 : 0
        }}
      />
      {/* Glossy top highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent z-0 opacity-50" />

      {/* 1. Floating Icon */}
      {Icon && (
        <div className={`relative mb-[20px] flex shrink-0 items-center justify-center w-[60px] h-[44px] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.9)] bg-gradient-to-br from-white to-slate-50 z-10 
        transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none motion-reduce:transform-none group-hover:scale-[1.08] group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,1)] ${getVariantStyles()}`}>
          {/* Ambient Glow */}
          <div className={`absolute -inset-1 rounded-2xl blur-xl opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${getGlowColor()}`}></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center rounded-2xl border border-slate-100/50 bg-white/50 backdrop-blur-sm">
            <Icon size={20} strokeWidth={2.2} />
          </div>
        </div>
      )}

      {/* 2. KPI Value */}
      <p className="text-kpi font-bold text-slate-800 leading-none mb-[10px] truncate font-sans w-full z-10 shrink-0 pointer-events-none transition-colors duration-300 group-hover:text-slate-900">
        {animatedDisplayValue}
      </p>

      {/* 3. KPI Title */}
      <h3 className="text-label font-medium text-slate-500 leading-tight mb-[6px] truncate font-sans w-full z-10 shrink-0 pointer-events-none transition-colors duration-300 group-hover:text-slate-600">
        {title}
      </h3>

      {/* 4. Supporting Description & Trend */}
      <div className="flex flex-col items-center w-full z-10 shrink-0 pointer-events-none">
        {subtitle && (
          <p className="text-caption text-slate-400 font-normal truncate max-w-[90%] font-sans mb-[6px]">
            {subtitle}
          </p>
        )}
        {trend && renderTrend()}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block w-full outline-none focus:ring-2 focus:ring-primary rounded-[var(--radius-surface-lg)]">{CardContent}</Link>;
  }

  return CardContent;
}

export default DashboardOverviewKPICard;
