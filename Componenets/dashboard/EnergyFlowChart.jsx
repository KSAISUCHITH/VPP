import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function EnergyFlowChart({ data, title = "Real-time Energy Flow" }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-200">
        <CardTitle className="text-lg font-semibold text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(time) => time.slice(-5)}
              />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="solar" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={false}
                name="Solar (kW)"
              />
              <Line 
                type="monotone" 
                dataKey="wind" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
                name="Wind (kW)"
              />
              <Line 
                type="monotone" 
                dataKey="battery" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                name="Battery (kW)"
              />
              <Line 
                type="monotone" 
                dataKey="demand" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                name="Demand (kW)"
              />
              <Line 
                type="monotone" 
                dataKey="grid" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={false}
                name="Grid (kW)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}