import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MetricCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  trendValue,
  color = "blue",
  status = "normal"
}) {
  const colorClasses = {
    blue: {
      gradient: "from-blue-400 to-blue-500",
      bg: "bg-blue-100",
      icon: "text-blue-600"
    },
    green: {
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-green-100",
      icon: "text-green-600"
    },
    amber: {
      gradient: "from-amber-400 to-yellow-500",
      bg: "bg-amber-100",
      icon: "text-amber-600"
    },
    red: {
      gradient: "from-red-400 to-pink-500",
      bg: "bg-red-100",
      icon: "text-red-600"
    },
    orange: {
      gradient: "from-orange-400 to-amber-500",
      bg: "bg-orange-100",
      icon: "text-orange-600"
    }
  };

  const statusColors = {
    normal: "text-slate-900",
    warning: "text-amber-700",
    critical: "text-red-700",
    good: "text-green-700"
  };

  const currentColors = colorClasses[color] || colorClasses.blue;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className="relative p-4 sm:p-6 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full opacity-30 transform translate-x-8 -translate-y-8" />
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
        <div className={`p-3 rounded-xl ${currentColors.bg} shadow-sm flex-shrink-0`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${currentColors.icon}`} />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend === 'up' ? 'bg-green-100 text-green-700 border border-green-200' : 
            trend === 'down' ? 'bg-red-100 text-red-700 border border-red-200' : 
            'bg-gray-100 text-gray-700 border border-gray-200'
          }`}>
            <TrendIcon className="w-3 h-3" />
            <span className="truncate">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 truncate">{title}</h3>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={`text-xl sm:text-2xl font-bold ${statusColors[status]} truncate`}>
            {value}
          </span>
          {unit && (
            <span className="text-xs sm:text-sm text-slate-600 font-semibold">{unit}</span>
          )}
        </div>
      </div>
    </Card>
  );
}