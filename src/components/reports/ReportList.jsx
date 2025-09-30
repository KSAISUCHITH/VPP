export { default } from '../../../components/reports/ReportList.jsx'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";

export default function ReportList({ reports, onViewReport, onDownloadReport }) {
  const getTypeColor = (type) => {
    switch (type) {
      case 'daily': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'weekly': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'monthly': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'custom': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-900">Recent Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm">No reports generated yet</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="p-3 border border-slate-200 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-200">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={`text-xs ${getTypeColor(report.report_type)}`}>
                      {report.report_type} report
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{format(new Date(report.created_date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium text-slate-900 mb-2">
                    {format(new Date(report.start_date), 'MMM d')} - {format(new Date(report.end_date), 'MMM d, yyyy')}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="truncate">
                      <span className="font-medium">Generation:</span> {report.total_generation?.toFixed(1) || '0'} kWh
                    </div>
                    <div className="truncate">
                      <span className="font-medium">Savings:</span> ${report.cost_savings?.toFixed(0) || '0'}
                    </div>
                    <div className="truncate">
                      <span className="font-medium">Carbon:</span> {report.carbon_savings?.toFixed(1) || '0'} kg CO₂
                    </div>
                    <div className="truncate">
                      <span className="font-medium">Renewable:</span> {report.renewable_percentage?.toFixed(0) || '0'}%
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewReport(report)}
                    className="text-xs px-2 py-1 h-8 w-8"
                    title="View Report"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownloadReport(report)}
                    className="text-xs px-2 py-1 h-8 w-8"
                    title="Download Report"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

