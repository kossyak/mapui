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
        color: [0, 128, 255, 0.7]
      },
      {
        key: 'intakes',
        title: 'Водозаборы',
        color: [0, 0, 128, 0.4]
      },
    ]
  },
  {
    title: 'Водоносный горизонт',
    key: 'aquifers',
    visible: true,
    hidden_aquifers: new Set()
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