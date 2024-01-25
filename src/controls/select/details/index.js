import coordinatesHTML from '../../../utils/coordinatesHTML'
import MS from '../../../microservice'

export default {
  fields: [
    {
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    }
  ],
  intakes: [
    {
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    }
  ],
  wells: [{
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    },
    {
      title: 'График режимных наблюдений',
      view: (selected, config) => {
        return new MS({ url: config.services.reg(selected) }).iframe
      }
    },
    {
      title: 'Разрез скважины',
      view: (selected, config) => {
        return new MS({ url: config.services.ws(selected) }).iframe
      }
    },
    {
      title: 'Данные ГИС',
      view: (selected, config) => {
        return new MS({ url: config.services.gis(selected) }).iframe
      }
    },
    {
      title: 'Данные по ОФР',
      view: (selected, config) => {
        return new MS({ url: config.services.efw(selected) }).iframe
      }
    },
    {
      title: 'Химический анализ',
      view: (selected, config) => {
        return new MS({ url: config.services.chem(selected) }).iframe
      }
    },
    {
      title: 'Датчик мониторинга уровня',
      view: (selected, config) => {
        return new MS({ url: config.services.mon(selected) }).iframe
      }
    }]
}