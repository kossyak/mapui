export default {
  pointSource: {
    url: 'app/map/points'
  },
  wells: {
    set: '/base/api/wells/'
  },
  fields: {
    get: 'app/map/fields',
    set: '/base/api/fields',
  },
  vzu: {
    getUrl: '/map/vzu',
    setUrl: '/base/api/vzu'
  },
  async loadPolygons(type) {
    const response = fetch(this[type].get)
    return await response.json()
  },
  async updateCoordinates(featureId, coordinates, type) {
    const url = `${this[type].set}${featureId}`
    const data = { coordinates }
    console.log(url)
    console.log('Отправляемый запрос:', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
}