
import React, { useState, useEffect } from "react";
import { Asset, SensorData, Forecast, Alert } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Activity, Sun, Wind, Battery, Zap, TrendingUp } from "lucide-react";

import MetricCard from "@/components/dashboard/MetricCard";
import EnergyFlowChart from "@/components/dashboard/EnergyFlowChart";
import AlertPanel from "@/components/dashboard/AlertPanel";
import RecommendationEngine from "@/components/dashboard/RecommendationEngine";

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [realTimeData, setRealTimeData] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    totalGeneration: 0,
    totalDemand: 0,
    batteryLevel: 0,
    gridUsage: 0,
    efficiency: 0,
    carbonSaved: 0
  });
  const [loading, setLoading] = useState(true);

  const loadAssets = async () => {
    try {
      const assetData = await Asset.list();
      setAssets(assetData);
    } catch (error) {
      console.error("Error loading assets:", error);
    }
  };

  const generateSimulatedData = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // Solar varies with time of day
    const solarBase = Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 150);
    const solar = Math.max(0, solarBase + (Math.random() - 0.5) * 20);
    
    // Wind is more random
    const wind = Math.max(0, 80 + (Math.random() - 0.5) * 60);
    
    // Demand follows campus patterns
    let demandBase = 100;
    if (hour >= 8 && hour <= 18) demandBase = 200; // Daytime
    if (hour >= 19 && hour <= 23) demandBase = 250; // Evening peak
    const demand = demandBase + (Math.random() - 0.5) * 30;
    
    // Battery charging/discharging based on surplus/deficit
    const generation = solar + wind;
    const surplus = generation - demand;
    const battery = surplus > 0 ? Math.min(surplus, 50) : Math.max(surplus, -50);
    
    // Grid fills the gap
    const grid = demand - generation + battery;
    
    return {
      time: now.toLocaleTimeString(),
      solar: parseFloat(solar.toFixed(1)),
      wind: parseFloat(wind.toFixed(1)),
      battery: parseFloat(battery.toFixed(1)),
      demand: parseFloat(demand.toFixed(1)),
      grid: parseFloat(grid.toFixed(1))
    };
  };

  const generateAlerts = async () => {
    try {
      const alerts = [
        {
          type: "warning",
          title: "High Grid Usage",
          message: "Campus consuming more than optimal from grid. Consider load shifting.",
          priority: "medium",
          action_required: true
        },
        {
          type: "recommendation",
          title: "Solar Surplus Available", 
          message: "Excess solar generation detected. Ideal time to run non-critical loads.",
          priority: "low",
          action_required: false
        },
        {
          type: "info",
          title: "Battery Charging",
          message: "Battery system automatically charging from solar surplus.",
          priority: "low",
          action_required: false
        }
      ];

      for (const alertData of alerts) {
        await Alert.create(alertData);
      }
    } catch (error) {
      console.error("Error generating alerts:", error);
    }
  };

  const generateForecast = async () => {
    try {
      const prompt = `Generate a 24-hour energy forecast for a university campus with solar panels, wind turbines, and battery storage. Current time: ${new Date().toLocaleTimeString()}. Include realistic recommendations for energy optimization.`;
      
      const forecast = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            predicted_generation: { type: "number" },
            predicted_demand: { type: "number" },
            weather_forecast: {
              type: "object", 
              properties: {
                temperature: { type: "number" },
                wind_speed: { type: "number" },
                cloud_cover: { type: "number" },
                solar_irradiance: { type: "number" }
              }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  asset: { type: "string" },
                  priority: { type: "string" },
                  savings_estimate: { type: "number" }
                }
              }
            }
          }
        }
      });

      await Forecast.create({
        forecast_time: new Date().toISOString(),
        horizon_hours: 24,
        ...forecast
      });
    } catch (error) {
      console.error("Error generating forecast:", error);
    }
  };

  useEffect(() => {
    const updateRealTimeData = () => {
      const newData = generateSimulatedData();
      
      setRealTimeData(prev => {
        const updated = [...prev, newData];
        return updated.slice(-20); // Keep last 20 points
      });

      setCurrentMetrics({
        totalGeneration: newData.solar + newData.wind,
        totalDemand: newData.demand,
        batteryLevel: Math.max(20, Math.min(95, 75 + newData.battery * 0.5)),
        gridUsage: Math.abs(newData.grid),
        efficiency: Math.min(98, 85 + Math.random() * 10),
        carbonSaved: ((newData.solar + newData.wind) * 0.5 * 24) / 1000
      });
    };

    const initializeDashboard = async () => {
      await loadAssets();
      await generateAlerts();
      await generateForecast();
      setLoading(false);
    };

    initializeDashboard();
    
    // Update real-time data every 5 seconds
    const interval = setInterval(updateRealTimeData, 5000);
    updateRealTimeData(); // Initial data
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 drop-shadow-sm">
            VPP Nexus Dashboard
          </h1>
          <p className="text-slate-700 mt-1 text-sm sm:text-base font-medium">Real-time campus energy orchestration</p>
        </div>
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-slate-700">Live Data</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          title="Total Generation"
          value={currentMetrics.totalGeneration.toFixed(1)}
          unit="kW"
          icon={Activity}
          color="green"
          trend="up"
          trendValue="+12%"
        />
        <MetricCard
          title="Campus Demand"
          value={currentMetrics.totalDemand.toFixed(1)}
          unit="kW"
          icon={Zap}
          color="blue"
          trend="down"
          trendValue="-3%"
        />
        <MetricCard
          title="Battery Level"
          value={currentMetrics.batteryLevel.toFixed(0)}
          unit="%"
          icon={Battery}
          color="amber"
          status={currentMetrics.batteryLevel < 30 ? "warning" : "good"}
        />
        <MetricCard
          title="Grid Usage"
          value={currentMetrics.gridUsage.toFixed(1)}
          unit="kW"
          icon={TrendingUp}
          color={currentMetrics.gridUsage > 100 ? "red" : "blue"}
          status={currentMetrics.gridUsage > 100 ? "warning" : "normal"}
        />
        <MetricCard
          title="System Efficiency"
          value={currentMetrics.efficiency.toFixed(1)}
          unit="%"
          icon={Activity}
          color="green"
          status="good"
        />
        <MetricCard
          title="Carbon Saved"
          value={currentMetrics.carbonSaved.toFixed(1)}
          unit="t CO₂"
          icon={Sun}
          color="green"
          trend="up"
          trendValue="+8%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <EnergyFlowChart data={realTimeData} />
        </div>
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          <AlertPanel />
          <RecommendationEngine />
        </div>
      </div>
    </div>
  );
}
