import './index.css'
import { _attr } from '../directives'

export default {
  template: `
  <label class="lstCheckbox">
    <input type="checkbox" class="lstCheckboxInp">
    <span class="lstCheckmark"></span>
    <span class="lstCheckboxText"></span>
  </label>`,
  directives: { _attr },
  props: {
    proxies: {
      value: {},
      disabled: {},
      error: {}
    },
    params: {
      name: { default: '' },
      size: { default: 'medium' },
      text: {}
    },
    methods: {
      action: {}
    }
  },
  nodes() {
    return {
      lstCheckbox: {
        _attr: {
          size: this.param.size
        }
      },
      lstCheckboxInp: {
        checked: () => this.proxy.value,
        onchange: (event) => {
          this.proxy.value = event.target.checked
          this.method.action?.(this.param.name, event.target.checked)
        }
      },
      lstCheckboxText: {
        _text: () => this.param.text ?? ''
      }
    }
  },
  methods: {
    set(v) {
      this.proxy.value = v
    }
  }
}