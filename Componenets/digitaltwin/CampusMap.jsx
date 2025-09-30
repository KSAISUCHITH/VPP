import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Wind, Battery, Zap, Building, Car } from "lucide-react";

export default function CampusMap() {
  const [assetData, setAssetData] = useState({});
  
  // Simulate real-time asset data
  const updateAssetData = () => {
    const now = new Date();
    const hour = now.getHours();
    
    setAssetData({
      solar1: {
        type: 'solar',
        output: Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 100 + (Math.random() - 0.5) * 20),
        capacity: 150,
        status: hour >= 6 && hour <= 18 ? 'generating' : 'idle'
      },
      solar2: {
        type: 'solar', 
        output: Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 80 + (Math.random() - 0.5) * 15),
        capacity: 120,
        status: hour >= 6 && hour <= 18 ? 'generating' : 'idle'
      },
      wind1: {
        type: 'wind',
        output: 60 + (Math.random() - 0.5) * 40,
        capacity: 100,
        status: 'generating'
      },
      battery1: {
        type: 'battery',
        output: (Math.random() - 0.5) * 80,
        capacity: 200,
        level: 75 + (Math.random() - 0.5) * 20,
        status: Math.random() > 0.5 ? 'charging' : 'discharging'
      },
      load1: {
        type: 'load',
        output: -120 - Math.random() * 30,
        name: 'Academic Buildings',
        status: 'consuming'
      },
      load2: {
        type: 'load',
        output: -80 - Math.random() * 20,
        name: 'Student Hostels', 
        status: 'consuming'
      }
    });
  };

  useEffect(() => {
    updateAssetData();
    const interval = setInterval(updateAssetData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getAssetIcon = (type) => {
    switch (type) {
      case 'solar': return Sun;
      case 'wind': return Wind;
      case 'battery': return Battery;
      case 'load': return Building;
      default: return Zap;
    }
  };

  const getStatusColor = (asset) => {
    if (asset.type === 'battery') {
      return asset.status === 'charging' ? 'text-emerald-500' : 'text-blue-500';
    }
    if (asset.type === 'load') {
      return 'text-red-500';
    }
    if (asset.output > 0) {
      return 'text-emerald-500';
    }
    return 'text-slate-400';
  };

  const getStatusText = (asset) => {
    if (asset.type === 'battery') {
      return `${asset.status === 'charging' ? 'Charging' : 'Discharging'} (${asset.level.toFixed(0)}%)`;
    }
    if (asset.type === 'load') {
      return `${Math.abs(asset.output).toFixed(1)} kW`;
    }
    return asset.output > 5 ? `${asset.output.toFixed(1)} kW` : 'Idle';
  };

  const AssetMarker = ({ asset, x, y, id }) => {
    const Icon = getAssetIcon(asset.type);
    
    return (
      <g transform={`translate(${x}, ${y})`}>
        {/* Status indicator ring */}
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="none"
          stroke={asset.output > 0 || asset.type === 'load' ? '#10b981' : '#94a3b8'}
          strokeWidth="2"
          opacity={asset.output > 0 || asset.type === 'load' ? 1 : 0.5}
          className="animate-pulse"
        />
        
        {/* Asset icon background */}
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="white"
          stroke="#e2e8f0"
          strokeWidth="1"
          className="drop-shadow-sm"
        />
        
        {/* Asset icon */}
        <foreignObject x="-12" y="-12" width="24" height="24">
          <Icon className={`w-6 h-6 ${getStatusColor(asset)}`} />
        </foreignObject>
        
        {/* Asset label */}
        <text
          x="0"
          y="35"
          textAnchor="middle"
          className="text-xs font-medium fill-slate-700"
        >
          {id.toUpperCase()}
        </text>
        
        {/* Status text */}
        <text
          x="0"
          y="48"
          textAnchor="middle" 
          className="text-xs fill-slate-500"
        >
          {getStatusText(asset)}
        </text>
      </g>
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">Campus Digital Twin</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
              Live Status
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4 h-96 overflow-hidden relative">
          <svg width="100%" height="100%" viewBox="0 0 800 350" className="border border-slate-200 rounded-lg bg-white">
            {/* Campus background */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Buildings */}
            <rect x="200" y="100" width="120" height="80" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" rx="4" />
            <text x="260" y="145" textAnchor="middle" className="text-xs font-medium fill-slate-700">Academic Block</text>
            
            <rect x="450" y="120" width="100" height="60" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" rx="4" />
            <text x="500" y="155" textAnchor="middle" className="text-xs font-medium fill-slate-700">Hostels</text>

            {/* Roads */}
            <path d="M 0 200 L 800 200" stroke="#d1d5db" strokeWidth="20" opacity="0.5" />
            <path d="M 380 0 L 380 350" stroke="#d1d5db" strokeWidth="15" opacity="0.5" />
            
            {/* Energy flow lines (animated) */}
            <defs>
              <linearGradient id="energyFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Flow lines between assets */}
            {Object.entries(assetData).map(([id, asset]) => {
              if (asset.output > 0) {
                return (
                  <g key={`flow-${id}`}>
                    <line
                      x1="150" y1="80" 
                      x2="400" y2="180"
                      stroke="url(#energyFlow)"
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                  </g>
                );
              }
              return null;
            })}

            {/* Asset markers */}
            <AssetMarker asset={assetData.solar1 || {}} x="150" y="80" id="solar1" />
            <AssetMarker asset={assetData.solar2 || {}} x="650" y="60" id="solar2" />
            <AssetMarker asset={assetData.wind1 || {}} x="100" y="250" id="wind1" />
            <AssetMarker asset={assetData.battery1 || {}} x="700" y="280" id="battery1" />
            <AssetMarker asset={assetData.load1 || {}} x="260" y="140" id="load1" />
            <AssetMarker asset={assetData.load2 || {}} x="500" y="150" id="load2" />
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-600">Generating</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-slate-600">Discharging</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-600">Consuming</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
            <span className="text-slate-600">Idle</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}