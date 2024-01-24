export default {
  template: `<tr class="lstTr"></tr>`,
  props: {
    params: {
      index: {
        type: 'number'
      },
      realIndex: {
        type: 'number'
      }
    },
    proxies: {
      row: {
        type: 'object'
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
      lstTr: {
        _evalHTML: () => {
          let str = `<td>${this.param.index}</td>`
          for (const [key, value] of Object.entries(this.proxy.row)) {
            str += `<td name="${key}" title="${value}">${value}</td>`
          }
          return str
        },
        _class: {
          selected: () => this.proxy._selected.includes(this.param.realIndex)
        },
        onclick: () => this.method.action(this.proxy.row, this.param.realIndex)
      }
    }
  }
}