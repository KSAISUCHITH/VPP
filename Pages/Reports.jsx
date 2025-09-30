
import React, { useState, useEffect } from "react";
import { Report } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { FileText } from "lucide-react";
import { format } from "date-fns";

import ReportGenerator from "@/components/reports/ReportGenerator";    
import ReportList from "@/components/reports/ReportList";
import ReportViewer from "@/components/reports/ReportViewer";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadReports = async () => {
    try {
      const reportData = await Report.list("-created_date", 20);
      setReports(reportData);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (config) => {
    setGenerating(true);
    try {
      const prompt = `
        Generate a comprehensive energy report for a Virtual Power Plant campus for the period ${config.start_date} to ${config.end_date}.
        Report type: ${config.report_type}
        
        Include realistic data for:
        - Total renewable generation (kWh)
        - Total campus consumption (kWh) 
        - Grid import and export (kWh)
        - Cost savings ($)
        - Carbon emissions avoided (kg CO2)
        - Renewable energy percentage
        
        Base the calculations on a typical university campus with solar panels, wind turbines, battery storage, and smart load management.
      `;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            total_generation: { type: "number" },
            total_consumption: { type: "number" },
            grid_import: { type: "number" },
            grid_export: { type: "number" },
            cost_savings: { type: "number" },
            carbon_savings: { type: "number" },
            renewable_percentage: { type: "number" }
          }
        }
      });

      const reportData = {
        ...config,
        ...result
      };

      const newReport = await Report.create(reportData);
      await loadReports();
      setSelectedReport(newReport);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = (report) => {
    // Generate CSV content
    const csvContent = [
      ['Virtual Power Plant Energy Report'],
      ['Generated:', format(new Date(report.created_date), 'PPP')],
      ['Period:', `${format(new Date(report.start_date), 'PP')} - ${format(new Date(report.end_date), 'PP')}`],
      ['Type:', report.report_type],
      [''],
      ['Metric', 'Value', 'Unit'],
      ['Total Generation', report.total_generation?.toFixed(1) || '0', 'kWh'],
      ['Total Consumption', report.total_consumption?.toFixed(1) || '0', 'kWh'],
      ['Grid Import', report.grid_import?.toFixed(1) || '0', 'kWh'],
      ['Grid Export', report.grid_export?.toFixed(1) || '0', 'kWh'],
      ['Cost Savings', report.cost_savings?.toFixed(2) || '0', '$'],
      ['Carbon Savings', report.carbon_savings?.toFixed(1) || '0', 'kg CO₂'],
      ['Renewable Percentage', report.renewable_percentage?.toFixed(1) || '0', '%']
    ].map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vpp-report-${report.start_date}-${report.end_date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              Energy Reports
            </h1>
          </div>
          <p className="text-slate-600">Generate and view detailed energy performance reports</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div>
          <ReportGenerator 
            onGenerateReport={generateReport}
            loading={generating}
          />
        </div>

        {/* Report List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/80 h-32 rounded-lg border border-slate-200"></div>
              ))}
            </div>
          ) : (
            <ReportList 
              reports={reports}
              onViewReport={setSelectedReport}
              onDownloadReport={downloadReport}
            />
          )}
        </div>
      </div>

      {/* Report Viewer Modal */}
      {selectedReport && (
        <ReportViewer
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onDownload={() => {
            downloadReport(selectedReport);
            setSelectedReport(null);
          }}
        />
      )}
    </div>
  );
}
