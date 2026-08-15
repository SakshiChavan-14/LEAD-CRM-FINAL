import { CalendarClock, CheckCircle2, Clock, CalendarDays } from "lucide-react";
import React from "react";

const SummaryCard = ({ title, count, icon: Icon, isActive, onClick, colorClass, bgClass, borderHoverClass }) => (
  <button 
    onClick={onClick}
    className={`flex items-center p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer font-outfit ${
      isActive 
        ? `border-blue-500 ring-2 ring-blue-500/20 shadow-md ${bgClass}` 
        : `border-slate-200/80 bg-white hover:shadow-md hover:border-slate-300 ${borderHoverClass}`
    }`}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive ? 'bg-white shadow-xs' : bgClass} ${colorClass} mr-3.5 shrink-0 transition-transform group-hover:scale-105`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">{count || 0}</p>
    </div>
  </button>
);

export default function SummaryCards({ summaryCards, activeTab, onTabChange }) {
  const cards = [
    { 
      id: "today", 
      title: "Today's Work", 
      count: summaryCards?.today, 
      icon: Clock, 
      colorClass: "text-blue-600", 
      bgClass: "bg-blue-50",
      borderHoverClass: "hover:border-blue-200"
    },
    { 
      id: "upcoming", 
      title: "Upcoming", 
      count: summaryCards?.upcoming, 
      icon: CalendarDays, 
      colorClass: "text-purple-600", 
      bgClass: "bg-purple-50",
      borderHoverClass: "hover:border-purple-200"
    },
    { 
      id: "overdue", 
      title: "Missed / Overdue", 
      count: summaryCards?.overdue, 
      icon: CalendarClock, 
      colorClass: "text-rose-600", 
      bgClass: "bg-rose-50",
      borderHoverClass: "hover:border-rose-200"
    },
    { 
      id: "completed", 
      title: "Completed", 
      count: summaryCards?.completed, 
      icon: CheckCircle2, 
      colorClass: "text-emerald-600", 
      bgClass: "bg-emerald-50",
      borderHoverClass: "hover:border-emerald-200"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <SummaryCard 
          key={card.id}
          title={card.title}
          count={card.count}
          icon={card.icon}
          colorClass={card.colorClass}
          bgClass={card.bgClass}
          borderHoverClass={card.borderHoverClass}
          isActive={activeTab === card.id}
          onClick={() => onTabChange(card.id)}
        />
      ))}
    </div>
  );
}
