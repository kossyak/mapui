export default [
  {
    title: 'Скважины',
    key: 'wells',
    visible: true,
    children: [{
      key: 'p26',
      typo: 26,
      title: 'Эксплуатационные',
      visible: true
    },
    {
      key: 'p31',
      typo: 31,
      title: 'Наблюдательные',
      visible: true
    },
    {
      key: 'p43',
      typo: 43,
      title: 'Проектные',
      visible: true
    },
    {
      key: 'p654',
      typo: 654,
      title: 'Инженерные',
      visible: true
    }]
  },
  {
    title: 'Полигоны',
    key: 'polygons',
    visible: true,
    children: [
      {
        key: 'fields',
        title: 'Месторождения',
        color: '#0080FFB3', // [0, 128, 255, 0.7]
        visible: true,
      },
      {
        key: 'intakes',
        title: 'Водозаборы',
        color: '#00008066', // [0, 0, 128, 0.4]
        visible: true,
      },
      {
        key: 'license',
        title: 'Лицензии',
        color: '#99999999', // [0, 0, 128, 0.4]
        visible: true,
      },
    ]
  },
  {
    title: 'Профиля',
    key: 'section',
    visible: true,
    children: [
      {
        key: 'sections',
        title: 'Разрезы',
        color: '#0080FFB3',
        visible: true
      }
    ]
  },
  {
    title: 'Водоносный горизонт',
    key: 'aquifers',
    visible: true,
    hidden_aquifers: new Set()
  },
  {
    title: 'Данные',
    key: 'filters',
    visible: true,
    hidden_filters: new Set()
  },
  {
    title: 'Геологические и гидрогеологические карты',
    visible: false
  },
  {
    title: 'Карта высот',
    visible: false,
    type: 'tile',
    children: [
      {
        key: 'terrain',
        title: 'MapBox'
      }
    ]
  },
  {
    title: 'Спутниковые снимки',
    visible: false,
    type: 'tile',
    children: [
      {
        key: 'arcgis_sp',
        title: 'ArcGIS'
      },
      {
        key: 'google_sp',
        title: 'Google'
      }
    ]
  }
]