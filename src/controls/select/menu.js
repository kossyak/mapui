export default {
  fields: [
    {
      key: 'coord',
      title: 'Координаты',
      view: (selected) => {
        const coordinates = selected.geometry.flatCoordinates
        const html = coordinates.reduce((accum, current) => accum + `<div>${current}</div>`, '')
        return html
      }
    }
  ],
  VZU: [
    {
      key: 'coord',
      title: 'Координаты',
      view: (selected) => {
        return selected.geometry.flatCoordinates
      }
    }
  ],
  points: [{
      key: 'coord',
      title: 'Координаты',
      view: (selected) => {
        const coordinates = selected.geometry.flatCoordinates
        const html = coordinates.reduce((accum, current) => accum + `<div>${current}</div>`, '')
        return html
      }
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