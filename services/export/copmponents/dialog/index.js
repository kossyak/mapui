import './index.css'
import button from '../button'

export default {
  template: `
  <dialog class="lstDialog l-scrollbar">
    <div class="lstClose"></div>
    <h3 class="lstDialogHd"></h3>
    <p class="lstDialogTxt"></p>
    <div section="content"></div>
    <div class="l-fx l-jc-end">
      <div class="lstDialogReject"></div>
      <div class="lstDialogAllow"></div>
    </div>
  </dialog>`,
  props: {
    params: {
      cancelable: {},
      expanded: {},
      name: {},
      title: {},
      text: {},
      allow: {},
      reject: {}
    },
    proxies: {
      opened: {
        default: false
      }
    },
    methods: {
      onclose: {},
      allow: {},
      reject: {}
    }
  },
  handlers: {
    opened(v) {
      v ? this.node.lstDialog.showModal() : this.node.lstDialog.close()
    }
  },
  nodes() {
    return {
      lstDialog: {
        _class: {
          'l-full-screen': () => this.param.expanded,
          ['dialog_' + this.param.name]: () => this.param.name
        },
        oncancel: (e) => {
          this.param.cancelable ? this.method.onclose() : e.preventDefault()
        }
      },
      lstClose: {
        hidden: !this.param.cancelable,
        onclick: () => this.method.onclose()
      },
      lstDialogHd: {
        _text: () => this.param.title,
      },
      lstDialogTxt: {
        _text: () => this.param.text,
      },
      lstDialogReject: {
        component: {
          induce: () => this.param.reject,
          src: button,
          params: {
            text: () => this.param.reject.text,
            type: () => this.param.reject.type || 'text'
          },
          methods: {
            action: () => {
              this.method.reject?.()
              this.method.onclose()
            }
          }
        }
      },
      lstDialogAllow: {
        component: {
          induce: () => this.param.allow,
          src: button,
          params: {
            text: () => this.param.allow.text,
            type: () => this.param.allow.type || 'text'
          },
          methods: {
            action: () => {
              this.method.allow?.()
              this.method.onclose()
            }
          }
        }
      },
    }
  },
  methods: {
    opened(v) {
      this.proxy.opened = v
    }
  },
  mounted() {
    this.proxy.opened && this.node.lstDialog.showModal()
  }
}