import './index.css'
import list from '../../ui/components/list'

export default {
  selected: {},
  create(select, ui) {
    const infoPanel = this.infoElement()
    const update = (event) => this.update(event, select, infoPanel, ui)
    select.getFeatures().on('add', update)
    // select.on('select', () => {
    //   ui.navigate.content('')
    // })
    ui.navigate.on('close', () => select.getFeatures().clear())
    ui.navigate.on('back', () => {
      ui.navigate.extension.setTitle('')
      this.openEx(ui)
    })
    // select.getFeatures().on('remove', update)
    return infoPanel
  },
  infoElement() {
    const container = document.createElement('div')
    container.className = 'ol-control info-panel'
    container.hidden = true
    return container
  },
  list: [{
      title: 'График режимных наблюдений'
    },
    {
      title: 'Разрез скважины'
    },
    {
      title: 'Данные ГИС'
    },
    {
      title: 'Данные по ОФР'
    },
    {
      title: 'Разрез скважины'
    },
    {
      title: 'Химический анализ'
    },
    {
      title: 'Датчик мониторинга уровня'
    }],
  getEx(selected) {
    const {geometry, extra, name, typo, head, intake, field, field_name, intake_name} = selected.getProperties()
    const nameGwk = extra?.name_gwk || 'Н/Д'
    let html = '<div class="info-text">'
    const add = (label, text) => text ? `<div><span>${label}: </span><b>${text}</b></div>` : ''
    if (geometry.getType() === 'Point') {
      html += add('Номер ГВК', nameGwk)
       + add('Внутренний номер', name)
       + add('Тип', typo)
       + add('А.О. устья', head)
       + add('Водозабор', intake)
       + add('Месторождение', field)
    } else if (geometry.getType() === 'Polygon' || geometry.getType() === 'MultiPolygon') {
      if (field_name) {
        html += `<div><span>Месторождение: </span><b>${field_name}</b></div>`
      } else if (intake_name) {
        html += `<div><span>Владелец ВЗУ: </span><b>${intake_name}</b></div>`
      }
    }
    return html + '</div>'
  },
  getNavigate(selectedAll) {
    const list = []
    selectedAll.forEach((selected) => {
      const {extra, name, typo} = selected.getProperties()
      const nameGwk = extra?.name_gwk || 'Н/Д'
      list.push({
        selected,
        title: `<div><span>Номер </span>${name}</div>
                 <div><span>Номер ГВК </span>${nameGwk}</div>
                 <div><span>Тип </span>${typo}</div>`,
      })
    })
    return list
  },
  openEx(ui) {
    const html = this.getEx(this.selected)
    ui.navigate.extension.content(html)
    const listEx = list.create({
      list: this.list,
      onclick: (item) => {
        ui.navigate.extension.setTitle(item.title)
        if (item.title === 'Данные ГИС') {
          const img = document.createElement('img')
          img.src = 'GIS.png'
          ui.navigate.extension.content(img)
        }
        if (item.title === 'Разрез скважины') {
          const img = document.createElement('img')
          img.src = 'result.png'
          ui.navigate.extension.content(img)
        }
      }
    })
    ui.navigate.extension.addContent(listEx)
  },
  update(event, select, infoPanel, ui) {
    const selectedAll = select.getFeatures().getArray()
    if (selectedAll) {
      const listNavigate = this.getNavigate(selectedAll)
      const l = list.create({
        list: listNavigate,
        onclick: (v) => {
          this.selected = v.selected
          this.openEx(ui)
        }
      })
      ui.navigate.content(l)
      ui.navigate.classList.add('info')
      ui.navigate.visible(true)
    } else {
      ui.navigate.content('')
      ui.navigate.visible(false)
    }
  }
}

