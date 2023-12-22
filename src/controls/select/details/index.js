import { transform } from 'ol/proj'

function coordinatesHTML(c) {
  const coordinates = transform(c, 'EPSG:3857', 'EPSG:4326')
  const html = coordinates.reduce((accum, current) => accum + `<div>${current}</div>`, '')
  return html
}

export default {
  fields: [
    {
      key: 'coord',
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.geometry.flatCoordinates)
    }
  ],
  VZU: [
    {
      key: 'coord',
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.geometry.flatCoordinates)
    }
  ],
  wells: [{
      key: 'coord',
      title: 'Координаты',
      view: (selected) => coordinatesHTML(selected.geometry.flatCoordinates)
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