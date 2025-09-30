import data from '../../Entities/Asset.json'

function coerceToAssetArray(raw) {
  if (Array.isArray(raw)) return raw
  // When the JSON contains a schema-like object, synthesize a small demo dataset
  const now = Date.now()
  return [
    {
      id: String(now - 1),
      name: 'Solar Roof A',
      type: 'solar',
      capacity: 150,
      current_output: 110,
      status: 'online',
      location: { x: 10, y: 20, building: 'A' },
    },
    {
      id: String(now - 2),
      name: 'Wind Turbine West',
      type: 'wind',
      capacity: 120,
      current_output: 80,
      status: 'online',
      location: { x: 35, y: 12, building: 'Field' },
    },
    {
      id: String(now - 3),
      name: 'Battery Bank 1',
      type: 'battery',
      capacity: 300,
      current_output: -40,
      status: 'maintenance',
      location: { x: 18, y: 42, building: 'B' },
    },
  ]
}

export const Asset = {
  async list() {
    try {
      return coerceToAssetArray(data)
    } catch {
      return []
    }
  },
}


