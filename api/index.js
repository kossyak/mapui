import config from '../config.js'

const host = config.host
export default {
  wellsJson : {
    get: host + '/base/api/wells/?format=json&limit=300', // 'https://darcydb.ru/base/api/wells/?format=json&limit=300', // '/wells.json', // host + '/base/api/wells/?format=json&limit=300', //'https://darcydb.ru/base/api/wells/?format=json&limit=5000', // host + '/base/api/wells/?format=json&limit=5000',
    set: host + '/base/api/wells/'
  },
  fieldsJson : {
    get: host + '/base/api/fields/?format=json&limit=300', // host + '/base/api/fields/?format=json',
    set: host + '/base/api/fields/',
  },
  intakesJson : {
    get: host + '/base/api/intakes/?format=json&limit=300', // host + '/base/api/intakes/?format=json',
    set: host + '/base/api/intakes/'
  },
  samplesJson: {
    get: host + '/base/api/samples/?format=json&limit=300', // host + '/base/api/intakes/?format=json',
    set: host + '/base/api/samples/'
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