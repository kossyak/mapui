import coordinatesHTML from '../coordinatesHTML'


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
      title: 'Химический анализ'
    },
    {
      key: 'mon',
      title: 'Датчик мониторинга уровня'
    }]
}