export default [
  {
    title: 'Скважины',
    visible: true,
    children: [{
      key: 'explo',
      typo: 26,
      title: 'Эксплуатационные',
      visible: true
    },
    {
      key: 'razv',
      typo: 27,
      title: 'Разведочные',
      visible: true
    },
    {
      key: 'razvexp',
      typo: 28,
      title: 'Разведочно-эксплуатационные',
      visible: true
    },
    {
      key: 'reg',
      typo: 25,
      title: 'Режимные',
      visible: true
    }, {
      key: 'min',
      typo: 49,
      title: 'Минеральные',
      visible: true
    }]
  },
  {
    title: 'Полигоны',
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