import coordinatesHTML from '../coordinatesHTML'
import MS from '../../../microservice'

export default {
  fields: [
    {
      key: 'coord',
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    }
  ],
  VZU: [
    {
      key: 'coord',
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    }
  ],
  wells: [{
      key: 'coord',
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    },
    {
      key: 'reg',
      title: 'График режимных наблюдений',
      view: (selected, config) => {
        return new MS({ url: config.services.reg(selected) }).iframe
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
      view: (selected, config) => {
        return new MS({ url: config.services.gis(selected) }).iframe
      }
    },
    {
      key: 'efw',
      title: 'Данные по ОФР',
      view: (selected, config) => {
        return new MS({ url: config.services.ofp(selected) }).iframe
      }
    },
    {
      key: 'chem',
      title: 'Химический анализ',
      view: (selected, config) => {
        return new MS({ url: config.services.him(selected) }).iframe
      }
    },
    {
      key: 'mon',
      title: 'Датчик мониторинга уровня',
      view: () => {
        return new MS({ url: 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=0&lon=0&zoom=2' }).iframe
      }
    }]
}