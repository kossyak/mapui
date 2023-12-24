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
      view: () => {
        const img = document.createElement('img')
        img.src = 'regime.png'
        return img
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
      view: () => {
        const img = document.createElement('img')
        img.src = 'GIS.png'
        return img
      }
    },
    {
      key: 'ofp',
      title: 'Данные по ОФР'
    },
    {
      key: 'him',
      title: 'Химический анализ',
      view: () => {
        return ms.create({ url: 'https://cdn.openai.com/papers/weak-to-strong-generalization.pdf' })
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