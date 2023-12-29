export default {
  wells: {
    get: '/points.json',
    set: '/base/api/wells/'
  },
  fields: {
    get: '/fields.json',
    set: '/base/api/fields',
  },
  vzu: {
    get: '/VZU.json',
    set: '/base/api/vzu'
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