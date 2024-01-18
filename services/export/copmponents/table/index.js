import './index.css'
import tbody from './tbody'

export default {
  template: `<table class="lstTable">
    <tbody class="lstTableHeader"></tbody>
    <tbody class="lstTableBody"></tbody>
  </table>`,
  props: {
    params: {
      header: {
        type: 'array'
      },
      options: {
        ignore: true
      }
    },
    proxies: {
      _tbody: {
        type: 'array'
      },
      _selected: {
        type: 'array'
      }
    },
    methods: {
      action: {}
    }
  },
  nodes() {
    return {
      lstTableHeader: {
        _evalHTML: () => this.proxy._tbody && this.method.header(this.param.options.header())
      },
      lstTableBody: {
        component: {
          src: tbody,
          iterate: () => this.proxy._tbody,
          params: {
            index: (_, i) => this.param.options.index(i),
            realIndex: (_, i) => i
          },
          proxies: {
            row: (el) => el,
            _selected: () => this.proxy._selected
          },
          methods: {
            action: this.method.action
          }
        }
      }
    }
  },
  methods: {
    header(header) {
      if (!header) return ''
      return '<colgroup>' + header.reduce((html) => html + `<col />`, '') + '</colgroup>' +
      '<tr>' + header.reduce((html, current) => html + `<th>${ current }</th>`, '<th></th>') + '</tr>'
    }
  }
}