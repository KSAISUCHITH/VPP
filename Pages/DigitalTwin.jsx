
import React, { useState, useEffect } from "react";
import { Asset, SensorData } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Sun, Wind, Battery, Zap, RefreshCw } from "lucide-react";

import CampusMap from "@/components/digitaltwin/CampusMap";

export default function DigitalTwin() {
  const [assets, setAssets] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalAssets: 0,
    activeAssets: 0,
    totalCapacity: 0,
    currentOutput: 0,
    systemHealth: 95
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const loadAssets = async () => {
    try {
      const assetData = await Asset.list();
      setAssets(assetData);
      
      // Calculate system stats
      const totalCapacity = assetData.reduce((sum, asset) => sum + (asset.capacity || 0), 0);
      const currentOutput = assetData.reduce((sum, asset) => sum + (asset.current_output || 0), 0);
      const activeAssets = assetData.filter(asset => asset.status === 'online').length;
      
      setSystemStats({
        totalAssets: assetData.length,
        activeAssets,
        totalCapacity,
        currentOutput,
        systemHealth: Math.min(98, 85 + Math.random() * 10)
      });
    } catch (error) {
      console.error("Error loading assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setLoading(true);
    setLastUpdate(new Date());
    setTimeout(() => {
      loadAssets();
    }, 1000);
  };

  useEffect(() => {
    loadAssets();
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      loadAssets();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getAssetIcon = (type) => {
    switch (type) {
      case 'solar': return Sun;
      case 'wind': return Wind;
      case 'battery': return Battery;
      case 'grid': return Zap;
      default: return Activity;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'offline': return 'bg-red-50 text-red-700 border-red-200';
      case 'maintenance': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Digital Twin Campus View
          </h1>
          <p className="text-slate-600 mt-1">Live visualization of campus energy infrastructure</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-slate-600">Last update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <Button
            onClick={refreshData}
            disabled={loading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Total Assets</p>
                <p className="text-lg font-bold text-slate-900">{systemStats.totalAssets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Active Assets</p>
                <p className="text-lg font-bold text-slate-900">{systemStats.activeAssets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Battery className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Total Capacity</p>
                <p className="text-lg font-bold text-slate-900">{systemStats.totalCapacity.toFixed(0)}</p>
                <p className="text-xs text-slate-500">kW</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Current Output</p>
                <p className="text-lg font-bold text-slate-900">{systemStats.currentOutput.toFixed(0)}</p>
                <p className="text-xs text-slate-500">kW</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">System Health</p>
                <p className="text-lg font-bold text-slate-900">{systemStats.systemHealth.toFixed(0)}</p>
                <p className="text-xs text-slate-500">%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Digital Twin Map */}
        <div className="lg:col-span-2">
          <CampusMap />
        </div>

        {/* Asset List */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900">Asset Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {assets.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Activity className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">No assets configured</p>
              </div>
            ) : (
              assets.map((asset) => {
                const Icon = getAssetIcon(asset.type);
                return (
                  <div key={asset.id} className="p-3 border border-slate-200 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-slate-900 truncate">
                            {asset.name}
                          </h4>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(asset.status)}`}>
                            {asset.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span>{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</span>
                          <span>{asset.capacity ? `${asset.capacity} kW` : 'N/A'}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Current: {asset.current_output ? `${asset.current_output} kW` : '0 kW'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
