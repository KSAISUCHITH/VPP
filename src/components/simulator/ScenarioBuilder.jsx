export { default } from '../../../components/simulator/ScenarioBuilder.jsx'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Save } from "lucide-react";

export default function ScenarioBuilder({ onRunSimulation, currentScenario, setCurrentScenario }) {
  const handleSliderChange = (key, value) => {
    setCurrentScenario(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  const handleSwitchChange = (key, checked) => {
    setCurrentScenario(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const resetScenario = () => {
    setCurrentScenario({
      solarCapacity: 100,
      windCapacity: 100,
      batteryCapacity: 100,
      demandLevel: 100,
      weatherCondition: 'sunny',
      timeOfDay: 12,
      hvacDelay: false,
      loadShifting: false,
      gridExport: true,
      duration: 24
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-900 mb-3">Scenario Builder</CardTitle>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            onClick={onRunSimulation}
            className="bg-emerald-600 hover:bg-emerald-700 gap-2 w-full"
          >
            <Play className="w-4 h-4" />
            Run Simulation
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={resetScenario}
            className="gap-2 w-full"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Asset Capacity Adjustments */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Asset Capacity Adjustments</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm">Solar Capacity</Label>
                <Badge variant="outline" className="text-xs">
                  {currentScenario.solarCapacity}%
                </Badge>
              </div>
              <Slider
                value={[currentScenario.solarCapacity]}
                onValueChange={(value) => handleSliderChange('solarCapacity', value)}
                max={200}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm">Wind Capacity</Label>
                <Badge variant="outline" className="text-xs">
                  {currentScenario.windCapacity}%
                </Badge>
              </div>
              <Slider
                value={[currentScenario.windCapacity]}
                onValueChange={(value) => handleSliderChange('windCapacity', value)}
                max={200}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm">Battery Capacity</Label>
                <Badge variant="outline" className="text-xs">
                  {currentScenario.batteryCapacity}%
                </Badge>
              </div>
              <Slider
                value={[currentScenario.batteryCapacity]}
                onValueChange={(value) => handleSliderChange('batteryCapacity', value)}
                max={200}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm">Campus Demand</Label>
                <Badge variant="outline" className="text-xs">
                  {currentScenario.demandLevel}%
                </Badge>
              </div>
              <Slider
                value={[currentScenario.demandLevel]}
                onValueChange={(value) => handleSliderChange('demandLevel', value)}
                max={150}
                min={50}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Environmental Conditions</h3>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm">Time of Day</Label>
              <Badge variant="outline" className="text-xs">
                {currentScenario.timeOfDay}:00
              </Badge>
            </div>
            <Slider
              value={[currentScenario.timeOfDay]}
              onValueChange={(value) => handleSliderChange('timeOfDay', value)}
              max={23}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Smart Controls */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Smart Controls</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white/50">
              <div>
                <Label className="text-sm font-medium">HVAC Load Shifting</Label>
                <p className="text-xs text-slate-600 mt-1">Delay HVAC to match solar surplus</p>
              </div>
              <Switch
                checked={currentScenario.hvacDelay}
                onCheckedChange={(checked) => handleSwitchChange('hvacDelay', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white/50">
              <div>
                <Label className="text-sm font-medium">Smart Load Shifting</Label>
                <p className="text-xs text-slate-600 mt-1">Optimize non-critical loads</p>
              </div>
              <Switch
                checked={currentScenario.loadShifting}
                onCheckedChange={(checked) => handleSwitchChange('loadShifting', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white/50">
              <div>
                <Label className="text-sm font-medium">Grid Export</Label>
                <p className="text-xs text-slate-600 mt-1">Allow surplus export to grid</p>
              </div>
              <Switch
                checked={currentScenario.gridExport}
                onCheckedChange={(checked) => handleSwitchChange('gridExport', checked)}
              />
            </div>
          </div>
        </div>

        {/* Simulation Duration */}
        <div>
          <Label className="text-sm font-medium">Simulation Duration</Label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              type="number"
              value={currentScenario.duration}
              onChange={(e) => setCurrentScenario(prev => ({
                ...prev,
                duration: parseInt(e.target.value) || 24
              }))}
              min="1"
              max="168"
              className="w-20 text-center"
            />
            <span className="text-sm text-slate-600">hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


