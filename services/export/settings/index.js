import checkbox from '../components/checkbox'

export default {
  template: `<div class="checkboxes l-content"></div>`,
  props: {
    proxies: {
      _checkboxes: {}
    },
    methods: {
      change: {}
    }
  },
  nodes() {
    return {
      checkboxes: {
        component: {
          iterate: () => this.proxy._checkboxes,
          src: checkbox,
          params: {
            text: (el) => el.title,
            name: (_, i) => i
          },
          proxies: {
            value: (el) => el.checked,
          },
          methods: {
            action: this.method.change
          }
        }
      }
    }
  }
}