import { _attr } from '../directives'
import './index.css'
import '../spinner/index.css'

export default {
  template: `
  <button class="lstBtn l-fx-b l-br">
    <span class="lstBtnIcon l-fx l-jc-center"></span>
    <span class="lstBtnText"></span>
  </button>`,
  directives: { _attr },
  props: {
    proxies: {
      value: {},
      disabled: {},
      error: {}
    },
    params: {
      name: { default: '' },
      type: { default: 'button' },
      size: { default: 'medium' },
      text: {},
      options: { default: {} }
    },
    methods: {
      action: {}
    }
  },
  nodes() {
    return {
      lstBtn: {
        _class: {
          'l-fx-rev': this.param.options.iconPosition === 'end'
        },
        _attr: {
          size: this.param.size,
        },
        name: this.param.name,
        type: this.param.type,
        disabled: () => this.proxy.disabled,
        onclick: () => this.method.action?.(this.param.name)
      },
      lstBtnIcon: {
        _class: {
          lstSpinner: () => this.proxy.error
        },
        _html: () => this.param.options.icon
      },
      lstBtnText: {
        _text: () => this.param.text ?? this.proxy.value
      }
    }
  },
  methods: {
    spinner(v) {
      this.proxy.error = v
    }
  }
}