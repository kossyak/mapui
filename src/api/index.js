import config from '../../config'

const host = config.host
export default {
  wells: {
    get: host + '/points.json',
    set: host + '/base/api/wells/'
  },
  fields: {
    get: host + '/fields.json',
    set: host + '/base/api/fields',
  },
  vzu: {
    get: host + '/VZU.json',
    set: host + '/base/api/vzu'
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