
import React, { useState } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { TestTube } from "lucide-react";

import ScenarioBuilder from "@/components/simulator/ScenarioBuilder";
import SimulationResults from "@/components/simulator/SimulationResults";

export default function Simulator() {
  const [currentScenario, setCurrentScenario] = useState({
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

  const [simulationResults, setSimulationResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const prompt = `
        Simulate a Virtual Power Plant scenario for a university campus with the following parameters:
        - Solar capacity: ${currentScenario.solarCapacity}% of baseline
        - Wind capacity: ${currentScenario.windCapacity}% of baseline  
        - Battery capacity: ${currentScenario.batteryCapacity}% of baseline
        - Campus demand: ${currentScenario.demandLevel}% of baseline
        - Time of day: ${currentScenario.timeOfDay}:00
        - Duration: ${currentScenario.duration} hours
        - HVAC delay enabled: ${currentScenario.hvacDelay}
        - Load shifting enabled: ${currentScenario.loadShifting}
        - Grid export allowed: ${currentScenario.gridExport}

        Provide a detailed simulation with hourly energy flow, cost savings, carbon reduction, and optimization recommendations.
        Calculate realistic daily savings, carbon savings, renewable percentage, and grid usage.
      `;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            dailySavings: { type: "number" },
            carbonSavings: { type: "number" },
            renewablePercentage: { type: "number" },
            gridUsage: { type: "number" },
            hourlyData: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  hour: { type: "number" },
                  generation: { type: "number" },
                  demand: { type: "number" },
                  battery: { type: "number" },
                  grid: { type: "number" }
                }
              }
            },
            comparison: {
              type: "array",
              items: {
                type: "object", 
                properties: {
                  scenario: { type: "string" },
                  cost: { type: "number" },
                  carbon: { type: "number" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string" }
                }
              }
            }
          }
        }
      });

      setSimulationResults(result);
    } catch (error) {
      console.error("Error running simulation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TestTube className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              What-If Simulator
            </h1>
          </div>
          <p className="text-slate-600">Test different scenarios and optimize your campus energy strategy</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scenario Builder */}
        <div>
          <ScenarioBuilder 
            onRunSimulation={runSimulation}
            currentScenario={currentScenario}
            setCurrentScenario={setCurrentScenario}
          />
        </div>

        {/* Simulation Results */}
        <div className="lg:col-span-2">
          <SimulationResults 
            results={simulationResults}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
