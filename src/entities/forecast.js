import base from '../../Entities/Forecast.json'

function persist(list) {
  localStorage.setItem('forecasts', JSON.stringify(list))
}

function load() {
  const raw = localStorage.getItem('forecasts')
  return raw ? JSON.parse(raw) : base
}

export const Forecast = {
  async list(sort = '-forecast_time', limit = 50) {
    const items = load()
    return items.slice(0, limit)
  },
  async create(item) {
    const items = load()
    items.unshift(item)
    persist(items)
    return item
  },
}


