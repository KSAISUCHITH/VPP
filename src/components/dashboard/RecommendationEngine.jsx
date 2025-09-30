export { default } from '../../../components/dashboard/RecommendationEngine.jsx'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Forecast } from "@/entities/Forecast";
import { Lightbulb, DollarSign, Leaf, Clock, ChevronRight } from "lucide-react";

export default function RecommendationEngine() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecommendations = async () => {
    try {
      const forecasts = await Forecast.list("-forecast_time", 1);
      if (forecasts.length > 0 && forecasts[0].recommendations) {
        setRecommendations(forecasts[0].recommendations);
      }
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
    const interval = setInterval(loadRecommendations, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">Smart Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 h-20 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <CardTitle className="text-lg font-semibold text-slate-900">Smart Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto p-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <p className="text-sm font-medium">No recommendations available</p>
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-white/50 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className={`text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority || 'medium'} priority
                    </Badge>
                    {rec.savings_estimate && (
                      <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full border border-green-200">
                        <DollarSign className="w-3 h-3" />
                        ${rec.savings_estimate}/day
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1 break-words">
                    {rec.action}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Asset: {rec.asset}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs px-2 py-1 border-slate-300 text-slate-700 hover:bg-slate-100 flex-shrink-0">
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span>Recommended now</span>
                </div>
                <div className="flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-green-600 flex-shrink-0" />
                  <span>Eco-friendly</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

