import base from '../../Entities/Report.json'

function coerceToReportArray(raw) {
  if (Array.isArray(raw)) return raw
  const now = new Date()
  return [
    {
      id: 'rpt-1',
      title: 'Weekly Energy Summary',
      created_date: new Date(now),
      report_type: 'weekly',
      start_date: new Date(now.getTime() - 6 * 86400000),
      end_date: new Date(now),
      status: 'complete',
      summary: 'Weekly generation, demand, and savings overview.',
      total_generation: 1240,
      cost_savings: 86,
      carbon_savings: 42,
      renewable_percentage: 72,
    },
    {
      id: 'rpt-2',
      title: 'Monthly Cost Analysis',
      created_date: new Date(now.getTime() - 86400000 * 7),
      report_type: 'monthly',
      start_date: new Date(now.getTime() - 29 * 86400000),
      end_date: new Date(now.getTime() - 86400000 * 7),
      status: 'complete',
      summary: 'Cost breakdown and optimization opportunities.',
      total_generation: 5120,
      cost_savings: 315,
      carbon_savings: 186,
      renewable_percentage: 69,
    },
  ]
}

export const Report = {
  async list() {
    try {
      return coerceToReportArray(base)
    } catch {
      return []
    }
  },
}


