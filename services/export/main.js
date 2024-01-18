import './copmponents/general.css'
import './main.css'
import tabs from './copmponents/tabs'
import tabContent from './tabContent'

export default {
  template: `<div class="main l-container l-content"></div>`,
  params: {
    models: [
      {
        key: 'typo',
        title: 'Скважины',
        fields: [{
          key: 'nameGwk',
          title: 'Номер ГВК',
          checked: true
        },{
          key: 'name',
          title: 'Внутренний номер',
          checked: true
        },{
          key: 'typo',
          title: 'Тип',
          checked: true
        },{
          key: 'head',
          title: 'А.О. устья',
          checked: true
        },{
          key: 'intake',
          title: 'Водозабор',
          checked: true
        },{
          key: 'field',
          title: 'Месторождение',
          checked: true
        },{
          key: 'coordinates',
          title: 'Координаты',
          checked: true
        }]
      },
      {
        key: 'intake_name',
        title: 'Водозаборы',
        fields: [{
          key: 'intake_name',
          title: 'Владелец',
          checked: true
        },{
          key: 'coordinates',
          title: 'Координаты',
          checked: true
        }]
      },
      {
        key: 'field_name',
        title: 'Месторождения',
        fields: [{
          key: 'field_name',
          title: 'Наименование',
          checked: true
        },{
          key: 'coordinates',
          title: 'Координаты',
          checked: true
        }]
      },
    ]
  },
  proxies: {
    selectedIndex: 0
  },
  nodes() {
    return {
      main: {
        component: {
          src: tabs,
          proxies: {
            tabs: this.param.models.map(el => el.title),
            selectedIndex: () => this.proxy.selectedIndex
          },
          methods: {
            change: this.method.switchTab
          },
          sections: {
            content: {}
          }
        }
      }
    }
  },
  methods: {
    switchTab(n) {
      const selected = this.data.map(el => el.selected)
      const key = this.param.models[n].key
      const fields = this.param.models[n].fields
      const mapping = (item, acc, el) => {
        if (el.key === 'nameGwk') {
          return { ...acc, nameGwk: item.extra.name_gwk }
        } else if (el.key === 'coordinates') {
          return { ...acc, coordinates: item.geometry.flatCoordinates.toString() }
        } else return { ...acc, [el.key]: item[el.key] || '-' }
      }
      const data = selected.filter(el => el[key]).map(item => fields.filter(el => el.checked).reduce((acc, el) => mapping(item, acc, el), {}))
      this.node.main.section.content.mount({
        src: tabContent,
        params: { data, fields }
      })
      this.proxy.selectedIndex = n
    }
  },
  mounted() {
    this.method.switchTab(this.proxy.selectedIndex)
  }
}