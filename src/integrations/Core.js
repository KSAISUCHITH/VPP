export async function InvokeLLM({ prompt, response_json_schema }) {
  // Parse simple params from the prompt to make output responsive to UI values
  const get = (key, def) => {
    const m = new RegExp(key + ":\\s*([0-9.]+)").exec(prompt)
    return m ? Number(m[1]) : def
  }
  const solarPct = get('Solar capacity', 100) / 100
  const windPct = get('Wind capacity', 100) / 100
  const batteryPct = get('Battery capacity', 100) / 100
  const demandPct = get('Campus demand', 100) / 100
  const hourOfDay = get('Time of day', 12)

  const baseSolar = (i) => Math.max(0, Math.sin(((i - 6) * Math.PI) / 12) * 150)
  const baseWind = (i) => 60 + Math.sin(i * 0.3) * 25

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const solar = baseSolar(i) * solarPct
    const wind = baseWind(i) * windPct
    let demand = 120 * demandPct
    if (i >= 8 && i <= 18) demand = 200 * demandPct
    if (i >= 19 && i <= 23) demand = 250 * demandPct
    const generation = solar + wind
    const battery = (generation - demand) * 0.2 * batteryPct
    const grid = demand - generation - battery
    return { hour: i, generation, demand, battery, grid }
  })

  const dailyGeneration = hourlyData.reduce((s, h) => s + Math.max(0, h.generation), 0)
  const dailyDemand = hourlyData.reduce((s, h) => s + Math.max(0, h.demand), 0)
  const renewablePercentage = Math.min(100, Math.round((dailyGeneration / Math.max(1, dailyDemand)) * 100))
  const gridUsage = Math.round(hourlyData.reduce((s, h) => s + Math.max(0, h.grid), 0))
  const dailySavings = Math.round((renewablePercentage / 100) * 120)
  const carbonSavings = Math.round((renewablePercentage / 100) * 20)

  return {
    dailySavings,
    carbonSavings,
    renewablePercentage,
    gridUsage,
    hourlyData,
    comparison: [
      { scenario: 'Baseline', cost: 100, carbon: 100 },
      { scenario: 'Optimized', cost: Math.max(10, 100 - dailySavings), carbon: Math.max(10, 100 - carbonSavings) },
    ],
    recommendations: [
      { title: 'Shift HVAC to midday', description: 'Use solar surplus', impact: solarPct > 1 ? 'high' : 'medium' },
      { title: 'Battery pre-charge', description: 'Before evening peak', impact: batteryPct > 1 ? 'high' : 'medium' },
    ],
  }
}


