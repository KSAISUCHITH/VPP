import data from '../../Entities/Alert.json'

function persist(list) {
  localStorage.setItem('alerts', JSON.stringify(list))
}

function load() {
  const raw = localStorage.getItem('alerts')
  return raw ? JSON.parse(raw) : data
}

export const Alert = {
  async list(sort = '-created_date', limit = 50) {
    const alerts = load()
    return alerts.slice(0, limit)
  },
  async filter(query, sort = '-created_date', limit = 50) {
    const alerts = load().filter(a => !query.status || a.status === query.status)
    return alerts.slice(0, limit)
  },
  async create(alert) {
    const alerts = load()
    const withId = { id: String(Date.now()), status: 'active', created_date: new Date().toISOString(), ...alert }
    alerts.unshift(withId)
    persist(alerts)
    return withId
  },
  async update(id, attrs) {
    const alerts = load().map(a => (a.id === id ? { ...a, ...attrs } : a))
    persist(alerts)
    return alerts.find(a => a.id === id)
  },
}


