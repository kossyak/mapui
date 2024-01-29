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
      key: 'regime_count',
      title: 'График режимных наблюдений',
      view: (selected, config) => {
        return new MS({ url: config.services.reg(selected) }).iframe
      }
    },
    {
      key: 'lithology_count',
      title: 'Разрез скважины',
      view: (selected, config) => {
        return new MS({ url: config.services.ws(selected) }).iframe
      }
    },
    {
      key: 'geophysics_count',
      title: 'Данные ГИС',
      view: (selected, config) => {
        return new MS({ url: config.services.gis(selected) }).iframe
      }
    },
    {
      key: 'efw_count',
      title: 'Данные по ОФР',
      view: (selected, config) => {
        return new MS({ url: config.services.efw(selected) }).iframe
      }
    },
    {
      key: 'sample_count',
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