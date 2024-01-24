import './index.css'
import button from '../button'

export default {
  template: `<div class="lstTabs l-fx"></div><div section="content"></div>`,
  props: {
    proxies: {
      tabs: {},
      selectedIndex: {
        default: 0
      }
    },
    methods: {
      change: {}
    }
  },
  setters: {
    selectedIndex(v) {
      this.node.lstTabs.children[this.proxy.selectedIndex].classList.remove('l-active')
      return v
    }
  },
  handlers: {
    selectedIndex(v) {
      this.node.lstTabs.children[v].classList.add('l-active')
    }
  },
  nodes() {
    return {
      lstTabs: {
        component: {
          iterate: () => this.proxy.tabs,
          src: button,
          params: {
            name: (_, i) => i,
            text: (el) => el,
            type: 'text',
            size: 'large'
          },
          methods: {
            action: this.method.change
          }
        }
      }
    }
  },
  mounted() {
    this.node.lstTabs.children[this.proxy.selectedIndex].classList.add('l-active')
  }
}