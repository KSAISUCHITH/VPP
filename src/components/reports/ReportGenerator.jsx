export { default } from '../../../components/reports/ReportGenerator.jsx'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText, Download } from "lucide-react";
import { format } from "date-fns";

export default function ReportGenerator({ onGenerateReport, loading }) {
  const [reportConfig, setReportConfig] = useState({
    report_type: 'weekly',
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end_date: new Date(),
    format: 'pdf'
  });

  const handleGenerateReport = () => {
    const config = {
      ...reportConfig,
      start_date: format(reportConfig.start_date, 'yyyy-MM-dd'),
      end_date: format(reportConfig.end_date, 'yyyy-MM-dd')
    };
    onGenerateReport(config);
  };

  const setQuickRange = (days) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setReportConfig(prev => ({
      ...prev,
      start_date: start,
      end_date: end,
      report_type: days === 1 ? 'daily' : days === 7 ? 'weekly' : days === 30 ? 'monthly' : 'custom'
    }));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold text-slate-900">Generate Report</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Report Type</Label>
          <Select
            value={reportConfig.report_type}
            onValueChange={(value) => setReportConfig(prev => ({ ...prev, report_type: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily Report</SelectItem>
              <SelectItem value="weekly">Weekly Report</SelectItem>
              <SelectItem value="monthly">Monthly Report</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setQuickRange(1)}
            className="text-xs flex-1 min-w-[80px]"
          >
            Last 24h
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setQuickRange(7)}
            className="text-xs flex-1 min-w-[80px]"
          >
            Last 7 days
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setQuickRange(30)}
            className="text-xs flex-1 min-w-[80px]"
          >
            Last 30 days
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-1 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{format(reportConfig.start_date, 'MMM d, yyyy')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reportConfig.start_date}
                  onSelect={(date) => setReportConfig(prev => ({ ...prev, start_date: date }))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-sm font-medium">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-1 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{format(reportConfig.end_date, 'MMM d, yyyy')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reportConfig.end_date}
                  onSelect={(date) => setReportConfig(prev => ({ ...prev, end_date: date }))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Export Format</Label>
          <Select
            value={reportConfig.format}
            onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Report</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
              <SelectItem value="csv">CSV Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerateReport}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Generate Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}


