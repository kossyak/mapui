import table from '../copmponents/table'
import dialog from '../copmponents/dialog'
import btn from '../copmponents/button'

import settings from '../settings'

export default {
  template: `<div class="dialog"></div>
      <div class="l-content">
      <div class="controls l-fx l-gap l-ai-c">
        <div class="settings"></div>
        <div class="count"></div>
        <div class="remove"></div>
        <div class="export"></div>
      </div>
      <div class="table"></div>
    </div>`,
  props: {
    params: {
      data: {},
      fields: {}
    }
  },
  proxies: {
    fields: [],
    data: [],
    selected: [],
    opened: false
  },
  nodes() {
    return {
      dialog: {
        component: {
          src: dialog,
          params: {
            // name: dialog.name,
            title: 'Настройка таблицы',
            text: 'Выберите поля для отображения',
            allow: {
              text: 'Применить'
            },
            reject: {
              text: 'Отмена'
            }
          },
          proxies: {
            opened: () => this.proxy.opened
          },
          methods: {
            onclose: () => this.proxy.opened = false,
            reject: () => {
              this.proxy.fields = this.param.fields
            },
            allow: () => {
              const keys = this.proxy.fields.filter(el => el.checked).map(el => el.key)
              this.proxy.data = this.method.filterObjects(this.param.data, keys)
            }
          },
          sections: {
            content: {
              src: settings,
              proxies: {
                _checkboxes: () => this.proxy.fields
              },
              methods: {
                change: (i, v) => {
                  this.proxy.fields[i].checked = v
                }
              }
            }
          }
        }
      },
      count: {
        _text: () => `${this.proxy.data.length} / ${this.proxy.selected.length}`
      },
      settings: {
        component: {
          src: btn,
          params: {
            options: {
              icon: `<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
<path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`}},
          methods: {
            action: () => this.proxy.opened = true
          }
        }
      },
      remove: {
        component: {
          src: btn,
          params: {
            type: 'primary'
          },
          proxies: {
            value: () => 'Удалить',
            disabled: () => this.proxy.selected.length === 0
          },
          methods: {
            action: this.method.remove
          }
        }
      },
      export: {
        component: {
          src: btn,
          params: {
            type: 'primary',
            text: 'Экспорт SCV',
          },
          methods: {
            action: this.method.downloadCSV
          }
        }
      },
      table: {
        component: {
          src: table,
          params: {
            options: {
              header: () => this.proxy.fields.filter(el => el.checked).map(el => el.title),
              index: (index) => index + 1
            }
          },
          proxies: {
            _tbody: () => this.proxy.data,
            _selected: () => this.proxy.selected
          },
          methods: {
            action: (el, i) => {
              const index = this.proxy.selected.indexOf(i)
              index === -1 ? this.proxy.selected.push(i) : this.proxy.selected.splice(index, 1)
            }
          }
        }
      }
    }
  },
  methods: {
    filterObjects(arr, keys) {
      return arr.map(obj => keys.reduce((acc, key) => (key in obj && (acc[key] = obj[key]), acc), {}))
    },
    remove() {
      this.proxy.data = this.proxy.data.filter((element, index) => !this.proxy.selected.includes(index))
      this.proxy.selected = []
    },
    convertArrayOfObjectsToCSV(data) {
      let csv = ''
      const fields = this.proxy.fields.filter(el => el.checked)
      const keys = fields.map(el => el.key)
      data.forEach((item) => {
        keys.forEach((key, index) => {
          if (index > 0) csv += ','
          let fieldValue = item[key]
          if (typeof fieldValue === 'string' && (fieldValue.includes(',') || fieldValue.includes('"') || fieldValue.includes('\n'))) {
            fieldValue = `"${fieldValue.replace(/"/g, '""')}"`
          } else if (typeof fieldValue === 'number' && !isNaN(fieldValue)) {
            fieldValue = fieldValue.toString()
          }
          csv += fieldValue
        })
        csv += '\n'
      })
      return csv
    },
    downloadCSV() {
      const data = this.proxy.data
      const filename = 'data.csv'
      const csv = this.method.convertArrayOfObjectsToCSV(data)
      const csvFile = new Blob([csv], { type: 'text/csv' })
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(csvFile)
      downloadLink.download = filename
      downloadLink.style.display = 'none'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  },
  created() {
    this.proxy.fields = this.param.fields
    this.proxy.data = this.param.data
  }
}