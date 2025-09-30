
import React, { useState, useEffect } from "react";
import { Report, Forecast, SensorData } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Activity, Zap } from "lucide-react";

export default function Analytics() {
  const [forecastData, setForecastData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const forecasts = await Forecast.list("-forecast_time", 10);
      setForecastData(forecasts);

      // Generate trend data
      const trends = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
        const hour = date.getHours();
        const dayOfWeek = date.getDay();
        
        // Realistic generation patterns
        const solarBase = Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 150);
        const windBase = 80 + Math.sin(i * 0.2) * 30;
        const demandBase = (dayOfWeek === 0 || dayOfWeek === 6) ? 150 : 200; // Lower on weekends
        
        return {
          date: date.toISOString().split('T')[0],
          solar: solarBase * (0.8 + Math.random() * 0.4),
          wind: windBase * (0.8 + Math.random() * 0.4),
          demand: demandBase * (0.8 + Math.random() * 0.4),
          battery: (Math.random() - 0.5) * 40,
          savings: Math.random() * 100 + 50
        };
      });
      
      setTrendData(trends);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // Generate 24-hour forecast data
  const hourlyForecast = Array.from({ length: 24 }, (_, i) => {
    const solarBase = Math.max(0, Math.sin((i - 6) * Math.PI / 12) * 150);
    const wind = 60 + Math.sin(i * 0.3) * 25;
    let demand = 120;
    if (i >= 8 && i <= 18) demand = 200; // Daytime
    if (i >= 19 && i <= 23) demand = 250; // Evening peak
    
    return {
      hour: `${i.toString().padStart(2, '0')}:00`,
      predicted_generation: solarBase + wind,
      predicted_demand: demand + (Math.random() - 0.5) * 20,
      solar: solarBase,
      wind: wind
    };
  });

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              Advanced Analytics
            </h1>
          </div>
          <p className="text-slate-600">Deep insights into energy patterns and predictive forecasting</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-700">AI Powered</span>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Efficiency Trend</p>
                <p className="text-lg font-bold text-slate-900">+12%</p>
                <p className="text-xs text-emerald-600">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Peak Generation</p>
                <p className="text-lg font-bold text-slate-900">285 kW</p>
                <p className="text-xs text-blue-600">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Forecast Accuracy</p>
                <p className="text-lg font-bold text-slate-900">94.2%</p>
                <p className="text-xs text-amber-600">7-day avg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Grid Independence</p>
                <p className="text-lg font-bold text-slate-900">87%</p>
                <p className="text-xs text-purple-600">This week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 24-Hour Forecast */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900">24-Hour Forecast</CardTitle>
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                AI Prediction
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyForecast}>
                  <defs>
                    <linearGradient id="generation" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="demand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted_generation"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#generation)"
                    name="Predicted Generation (kW)"
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted_demand"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#demand)"
                    name="Predicted Demand (kW)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 30-Day Trends */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">30-Day Energy Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={12}
                    tickFormatter={(date) => new Date(date).getDate().toString()}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="solar" stroke="#f59e0b" strokeWidth={2} dot={false} name="Solar (kW)" />
                  <Line type="monotone" dataKey="wind" stroke="#10b981" strokeWidth={2} dot={false} name="Wind (kW)" />
                  <Line type="monotone" dataKey="demand" stroke="#ef4444" strokeWidth={2} dot={false} name="Demand (kW)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Savings Analysis */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">Daily Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={12}
                    tickFormatter={(date) => new Date(date).getDate().toString()}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="savings" fill="#3b82f6" name="Savings ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-medium text-emerald-900 mb-1">Peak Performance</h4>
                <p className="text-sm text-emerald-700 mb-2">
                  System achieved 94% efficiency during optimal conditions
                </p>
                <div className="text-xs text-emerald-600">
                  • Solar output peaked at 285 kW yesterday at 1:30 PM<br/>
                  • Wind generation consistent at 80-120 kW range<br/>
                  • Battery utilization optimized for cost savings
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-1">Optimization Opportunities</h4>
                <p className="text-sm text-blue-700 mb-2">
                  AI identified several areas for improvement
                </p>
                <div className="text-xs text-blue-600">
                  • Load shifting could save additional $25/day<br/>
                  • HVAC optimization during peak solar hours<br/>
                  • Consider 50kW battery expansion
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-1">Forecast Accuracy</h4>
                <p className="text-sm text-purple-700 mb-2">
                  Machine learning model performance metrics
                </p>
                <div className="text-xs text-purple-600">
                  • Solar prediction: 96.2% accuracy<br/>
                  • Wind prediction: 89.4% accuracy<br/>
                  • Demand prediction: 91.8% accuracy
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
