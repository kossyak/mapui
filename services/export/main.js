import './copmponents/general.css'
import './main.css'
import tabs from './copmponents/tabs'
import tabContent from './tabContent'

export default {
  template: `<div class="main l-container l-content"></div>`,
  proxies: {
    selectedIndex: 0
  },
  nodes() {
    return {
      main: {
        component: {
          src: tabs,
          proxies: {
            tabs: this.models.map(el => el.title),
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
      const key = this.models[n].key
      const fields = this.models[n].fields
      const mapping = (item, acc, el) => {
          return {...acc, [el.key]: item[el.key] || '-'}
      }
      const data = this.data.filter(el => el[key]).map(item => fields.filter(el => el.checked).reduce((acc, el) => mapping(item, acc, el), {}))
      this.node.main.section.content.mount({
        src: tabContent,
        params: { data, fields, key }
      })
      this.proxy.selectedIndex = n
    }
  },
  mounted() {
    this.method.switchTab(this.proxy.selectedIndex)
  }
}