export default [
  {
    title: 'Скважины',
    visible: true,
    children: [{
      key: 'explo',
      title: 'Эксплуатационные',
    },
    {
      key: 'razv',
      title: 'Разведочные',
    },
    {
      key: 'razvexp',
      title: 'Разведочно-эксплуатационные',
    },
    {
      key: 'reg',
      title: 'Режимные',
    }, {
      key: 'min',
      title: 'Минеральные',
    }]
  },
  {
    title: 'Полигоны',
    visible: true,
    children: [
      {
        key: 'fields',
        title: 'Меторождения',
        color: [0, 128, 255, 0.7],
      },
      {
        key: 'VZU',
        title: 'Водозаборы',
        color: [0, 0, 128, 0.4],
      }
    ]
  },
  { title: 'Геологические и гидрогеологические карты',
    visible: false },
  {
    title: 'Абсолютные отметки',
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