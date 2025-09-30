import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, X, Calendar, DollarSign, Leaf, Zap } from "lucide-react";
import { format } from "date-fns";

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

export default function ReportViewer({ report, onClose, onDownload }) {
  if (!report) return null;

  // Generate sample data for visualization based on report
  const dailyData = Array.from({ length: 7 }, (_, i) => ({
    day: format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
    generation: Math.random() * 200 + 100,
    consumption: Math.random() * 180 + 120,
    cost: Math.random() * 50 + 25
  }));

  const sourceData = [
    { name: 'Solar', value: 45, color: '#f59e0b' },
    { name: 'Wind', value: 30, color: '#10b981' },
    { name: 'Battery', value: 15, color: '#3b82f6' },
    { name: 'Grid', value: 10, color: '#ef4444' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Energy Report - {format(new Date(report.start_date), 'MMM d')} to {format(new Date(report.end_date), 'MMM d, yyyy')}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {report.report_type} report
                </Badge>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  Generated {format(new Date(report.created_date), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onDownload(report)}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Zap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Total Generation</p>
                    <p className="text-lg font-bold text-slate-900">
                      {report.total_generation?.toFixed(1) || '1,245.3'} kWh
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Cost Savings</p>
                    <p className="text-lg font-bold text-slate-900">
                      ${report.cost_savings?.toFixed(0) || '342'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Leaf className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Carbon Saved</p>
                    <p className="text-lg font-bold text-slate-900">
                      {report.carbon_savings?.toFixed(1) || '156.7'} kg CO₂
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Renewable %</p>
                    <p className="text-lg font-bold text-slate-900">
                      {report.renewable_percentage?.toFixed(0) || '87'}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900">Daily Energy Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="generation" stroke="#10b981" strokeWidth={2} name="Generation (kWh)" />
                      <Line type="monotone" dataKey="consumption" stroke="#ef4444" strokeWidth={2} name="Consumption (kWh)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900">Energy Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {sourceData.map((source, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="text-slate-700">{source.name} ({source.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900">Daily Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="cost" fill="#3b82f6" name="Daily Cost ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-medium text-emerald-900 mb-1">Key Achievements</h4>
                    <ul className="text-emerald-700 space-y-1 text-xs">
                      <li>• 87% of energy from renewable sources</li>
                      <li>• $342 saved compared to full grid consumption</li>
                      <li>• 156.7 kg CO₂ emissions avoided</li>
                      <li>• Peak solar generation: 145 kW</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-1">Recommendations</h4>
                    <ul className="text-blue-700 space-y-1 text-xs">
                      <li>• Consider adding 50kW battery capacity</li>
                      <li>• Optimize HVAC scheduling for peak solar hours</li>
                      <li>• Investigate demand response opportunities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}