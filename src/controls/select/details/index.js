import coordinatesHTML from '../coordinatesHTML'
import ms from '../../../microservice'

export default {
  fields: [
    {
      key: 'coord',
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.__coordinates)
    }
  ],
  VZU: [
    {
      key: 'coord',
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.__coordinates)
    }
  ],
  wells: [{
      key: 'coord',
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.__coordinates)
    },
    {
      key: 'reg',
      title: 'График режимных наблюдений',
      view: (selected) => {
        return ms.create({ url: 'http://127.0.0.1:8080/base/api/regime/' + selected.pk + '/plot/' })
      }
    },
    {
      key: 'raz',
      title: 'Разрез скважины',
      view: () => {
        const img = document.createElement('img')
        img.src = 'result.png'
        return img
      }
    },
    {
      key: 'gis',
      title: 'Данные ГИС',
      view: (selected) => {
        return ms.create({ url: 'http://127.0.0.1:8080/base/api/gph/' + selected.pk + '/list/' })
      }
    },
    {
      key: 'ofp',
      title: 'Данные по ОФР',
      view: (selected) => {
        return ms.create({ url: 'http://127.0.0.1:8080/base/api/efw/' + selected.pk + '/list/' })
      }
    },
    {
      key: 'him',
      title: 'Химический анализ',
      view: (selected) => {
        return ms.create({ url: 'http://127.0.0.1:8080/base/api/chem/' + selected.pk + '/list/' })
      }
    },
    {
      key: 'mon',
      title: 'Датчик мониторинга уровня',
      view: () => {
        return ms.create({ url: 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=0&lon=0&zoom=2' })
      }
    }]
}