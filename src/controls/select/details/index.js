import coordinatesHTML from '../../../utils/coordinatesHTML'
import MS from '../../../microservice'

export default {
  fields: [
    {
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    },
    {
      key: 'protocol',
      title: 'Протокол',
      view: (selected, config) => {
        return new MS({ url: config.services.protocol(selected) }).iframe
      }
    },
    {
      key: 'balances',
      title: 'Запасы',
      view: (selected, config) => {
        return new MS({ url: config.services.balances(selected) }).iframe
      }
    },
    {
      key: 'plan',
      title: 'План подсчета запасов',
      view: (selected, config) => {
        return new MS({ url: config.services.plan(selected) }).iframe
      }
    },
    {
      key: 'report',
      title: 'Отчет по оценке запасов',
      view: (selected, config) => {
        return new MS({ url: config.services.report(selected) }).iframe
      }
    },
    {
      key: 'documents',
      title: 'Документы',
      view: (selected, config) => {
        return new MS({ url: config.services.documents(selected) }).iframe
      }
    },
  ],
  intakes: [
    {
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    },
    {
      key: 'license',
      title: 'Лицензия',
      view: (selected, config) => {
        return new MS({ url: config.services.license(selected) }).iframe
      }
    },
    {
      key: 'wells',
      title: 'Список скважин',
      view: (selected, config) => {
        return new MS({ url: config.services.wells(selected) }).iframe
      }
    },
    {
      key: 'deadlines',
      title: 'Сроки выполнения условий недропользования',
      view: (selected, config) => {
        return new MS({ url: config.services.deadlines(selected) }).iframe
      }
    },
    {
      key: 'withdrawal',
      title: 'Водоотбор',
      view: (selected, config) => {
        return new MS({ url: config.services.withdrawal(selected) }).iframe
      }
    },
  ],
  license: [
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