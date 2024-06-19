import coordinatesHTML from '../../../utils/coordinatesHTML'
import ms from '../../../microservice'

export default {
  fields: [
    {
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    },
    {
      key: 'protocol_count',
      title: 'Протокол',
      view: (selected, config) => {
        return ms({ url: config.services.protocol(selected) })
      }
    },
    {
      key: 'balances_count',
      title: 'Запасы',
      view: (selected, config) => {
        return ms({ url: config.services.balances(selected) })
      }
    },
    {
      key: 'plan_count',
      title: 'План подсчета запасов',
      view: (selected, config) => {
        return ms({ url: config.services.plan(selected) })
      }
    },
    {
      key: 'report_count',
      title: 'Отчет по оценке запасов',
      view: (selected, config) => {
        return ms({ url: config.services.report(selected) })
      }
    },
    {
      key: 'docs_count',
      title: 'Документы',
      view: (selected, config) => {
        return ms({ url: config.services.documents(selected) })
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
        return ms({ url: config.services.license(selected) })
      }
    },
    {
      key: 'wells_count',
      title: 'Список скважин',
      view(selected, config) {
        return ms({ url: config.services.wells(selected), config })
      }
    },
    {
      key: 'deadlines',
      title: 'Сроки выполнения условий недропользования',
      view: (selected, config) => {
        return ms({ url: config.services.deadlines(selected) })
      }
    },
    {
      key: 'withdrawal',
      title: 'Водоотбор',
      view: (selected, config) => {
        return ms({ url: config.services.withdrawal(selected) })
      }
    },
  ],
  license: [
    {
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    }
  ],
  section: [
    {
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    }, {
      title: 'Разрез',
      view: (selected, config) => {
        return ms({ url: config.services.source_file(selected) })
      }
    }, {
      title: 'Список скважин',
      view: (selected, config) => {
        return ms({ url: config.services.pois(selected) })
      }
    }, {
      title: 'Карта к разрезу',
      view: (selected, config) => {
        return ms({ url: config.services.map_ref(selected) })
      }
    }
  ],
  wells: [{
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.coordinates)
    },
    {
      key: 'regime_count',
      title: 'Режимные наблюдения',
      view: (selected, config) => {
        return ms({ url: config.services.reg(selected) })
      }
    },
    {
      key: 'lithology_count',
      title: 'Разрез и конструкция',
      view: (selected, config) => {
        return ms({ url: config.services.ws(selected) })
      }
    },
    {
      key: 'geophysics_count',
      title: 'ГИС',
      view: (selected, config) => {
        return ms({ url: config.services.gis(selected) })
      }
    },
    {
      key: 'efw_count',
      title: 'ОФР',
      view: (selected, config) => {
        return ms({ url: config.services.efw(selected) })
      }
    },
    {
      key: 'sample_count',
      title: 'Химические анализы',
      view: (selected, config) => {
        return ms({ url: config.services.chem(selected) })
      }
    },
    {
      key: 'docs_count',
      title: 'Документы',
      view: (selected, config) => {
        return ms({ url: config.services.docs(selected) })
      }
    },
    {
      title: 'Связанное оборудование',
      view: (selected, config) => {
        return ms({ url: config.services.mon(selected) })
      }
  }]
}