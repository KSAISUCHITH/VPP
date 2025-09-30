
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Bell, Zap, Shield, Database } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      alerts: true,
      reports: false,
      maintenance: true
    },
    thresholds: {
      battery_low: 25,
      grid_usage_high: 150,
      efficiency_low: 80,
      temperature_high: 40
    },
    system: {
      data_retention: 365,
      auto_reports: 'weekly',
      prediction_horizon: 24,
      refresh_interval: 30
    }
  });

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handleThresholdChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: parseFloat(value) || 0
      }
    }));
  };

  const handleSystemChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // In a real app, save to backend/database
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-slate-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              System Settings
            </h1>
          </div>
          <p className="text-slate-600">Configure alerts, thresholds, and system preferences</p>
        </div>
        <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
      </div>

      {/* Settings Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-lg font-semibold text-slate-900">Notification Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white/50">
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-slate-600 mt-1">Receive system updates via email</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white/50">
              <div>
                <Label className="text-sm font-medium">Critical Alerts</Label>
                <p className="text-xs text-slate-600 mt-1">Immediate notifications for system issues</p>
              </div>
              <Switch
                checked={settings.notifications.alerts}
                onCheckedChange={(checked) => handleNotificationChange('alerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white/50">
              <div>
                <Label className="text-sm font-medium">Automated Reports</Label>
                <p className="text-xs text-slate-600 mt-1">Weekly/monthly report summaries</p>
              </div>
              <Switch
                checked={settings.notifications.reports}
                onCheckedChange={(checked) => handleNotificationChange('reports', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white/50">
              <div>
                <Label className="text-sm font-medium">Maintenance Reminders</Label>
                <p className="text-xs text-slate-600 mt-1">Scheduled maintenance notifications</p>
              </div>
              <Switch
                checked={settings.notifications.maintenance}
                onCheckedChange={(checked) => handleNotificationChange('maintenance', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alert Thresholds */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-lg font-semibold text-slate-900">Alert Thresholds</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Battery Low Threshold</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={settings.thresholds.battery_low}
                  onChange={(e) => handleThresholdChange('battery_low', e.target.value)}
                  min="0"
                  max="100"
                  className="w-20"
                />
                <span className="text-sm text-slate-600">%</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">High Grid Usage Threshold</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={settings.thresholds.grid_usage_high}
                  onChange={(e) => handleThresholdChange('grid_usage_high', e.target.value)}
                  min="0"
                  className="w-24"
                />
                <span className="text-sm text-slate-600">kW</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Low Efficiency Threshold</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={settings.thresholds.efficiency_low}
                  onChange={(e) => handleThresholdChange('efficiency_low', e.target.value)}
                  min="0"
                  max="100"
                  className="w-20"
                />
                <span className="text-sm text-slate-600">%</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">High Temperature Alert</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={settings.thresholds.temperature_high}
                  onChange={(e) => handleThresholdChange('temperature_high', e.target.value)}
                  min="0"
                  className="w-20"
                />
                <span className="text-sm text-slate-600">°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg font-semibold text-slate-900">System Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Data Retention Period</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={settings.system.data_retention}
                  onChange={(e) => handleSystemChange('data_retention', parseInt(e.target.value))}
                  min="30"
                  max="2555"
                  className="w-24"
                />
                <span className="text-sm text-slate-600">days</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Automatic Report Frequency</Label>
              <Select
                value={settings.system.auto_reports}
                onValueChange={(value) => handleSystemChange('auto_reports', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Prediction Horizon</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={settings.system.prediction_horizon}
                  onChange={(e) => handleSystemChange('prediction_horizon', parseInt(e.target.value))}
                  min="1"
                  max="168"
                  className="w-20"
                />
                <span className="text-sm text-slate-600">hours</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Dashboard Refresh Interval</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={settings.system.refresh_interval}
                  onChange={(e) => handleSystemChange('refresh_interval', parseInt(e.target.value))}
                  min="5"
                  max="300"
                  className="w-20"
                />
                <span className="text-sm text-slate-600">seconds</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              <CardTitle className="text-lg font-semibold text-slate-900">Security & Access</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-900 mb-2">System Access</h4>
              <p className="text-sm text-red-700 mb-3">
                Control access levels and system permissions
              </p>
              <Button variant="outline" size="sm" className="text-red-700 border-red-200">
                Manage Users
              </Button>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-900 mb-2">API Keys</h4>
              <p className="text-sm text-amber-700 mb-3">
                Configure integration with external systems
              </p>
              <Button variant="outline" size="sm" className="text-amber-700 border-amber-200">
                View API Settings
              </Button>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">System Backup</h4>
              <p className="text-sm text-blue-700 mb-3">
                Automated backup and disaster recovery
              </p>
              <Button variant="outline" size="sm" className="text-blue-700 border-blue-200">
                Backup Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
