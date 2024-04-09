export default [
  {
    key: 'wells',
    title: 'Скважины',
    fields: [{
      key: 'gvk',
      title: 'Номер ГВК',
      checked: true
    },{
      key: 'name',
      title: 'Внутренний номер',
      checked: true
    },{
      key: 'typo_string',
      title: 'Тип',
      checked: true
    },{
      key: 'head',
      title: 'А.О. устья',
      checked: true
    },{
      key: 'intake_string',
      title: 'Водозабор',
      checked: true
    },{
      key: 'field_string',
      title: 'Месторождение',
      checked: true
    },{
      key: 'coordinates',
      title: 'Координаты',
      checked: true
    },{
      key: 'aquifer_usage_string',
      title: 'Эксплуатируемый горизонт',
      checked: true
    },
    {
      key: 'id',
      title: 'id',
      hidden: true
    }]
  },
  {
    key: 'intakes',
    title: 'Водозаборы',
    fields: [{
      key: 'name',
      title: 'Владелец',
      checked: true
    },{
      key: 'coordinates',
      title: 'Координаты',
      checked: true
    }]
  },
  {
    key: 'fields',
    title: 'Месторождения',
    fields: [{
      key: 'name',
      title: 'Наименование',
      checked: true
    },{
      key: 'coordinates',
      title: 'Координаты',
      checked: true
    }]
  },
]