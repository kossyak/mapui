import './index.css'
import menu from './menu'
import tap from '../../ui/components/tap'
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
    ui.navigate.classList.add('info')
    ui.navigate.on('close', () => {
      select.getFeatures().clear()
    })
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
  getEx(selected) {
    const { geometry, extra, name, typo, head, intake, field, field_name, intake_name } = selected
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
      + add('С.Ш', geometry.flatCoordinates[0])
      + add('В.Д', geometry.flatCoordinates[1])
    } else if (geometry.getType() === 'Polygon' || geometry.getType() === 'MultiPolygon') {
      html += add('Месторождение', field_name) + add('Владелец ВЗУ', intake_name)
    }
    return html + '</div>'
  },
  getNavigate(selectedAll) {
    const list = []
    selectedAll.forEach((s) => {
      const selected = s.getProperties()
      const {extra, name, typo, field_name, intake_name } = selected
      const nameGwk = extra?.name_gwk || 'Н/Д'
      console.log(intake_name)
      let type = {
        key: 'points',
        text: typo
      }
      if (intake_name) type = {
        key: 'VZU',
        text: 'водозабор'
      }
      if (field_name) type = {
        key: 'fields',
        text: 'месторождение'
      }
      selected.type = type.key
      list.push({
        selected,
        title: `<div><span>Номер: </span>${name || 'б/н'}</div>
                <div><span>Номер ГВК: </span>${nameGwk}</div>
                <div><span>Тип: </span>${type.text}</div>`,
      })
    })
    return list
  },
  openEx(ui) {
    const editBtn = tap.create({
      html: 'Редактировать <i>✎</i>',
      onclick: () => {
        ui.navigate.extension.setTitle('Редактирование')
      }
    })
    const html = this.getEx(this.selected)
    ui.navigate.extension.content(editBtn)
    ui.navigate.extension.addContent(html)
    const type = this.selected.type
    const listEx = list.create({
      list: menu[type],
      onclick: (item, index) => {
        ui.navigate.extension.setTitle(item.title)
        const content = menu[type][index].view?.(this.selected)
        if (content) ui.navigate.extension.content(content)
      }
    })
    ui.navigate.extension.addContent(listEx)
  },
  update(event, select, infoPanel, ui) {
    ui.navigate.extension.content('')
    const selectedAll = select.getFeatures().getArray()
    if (selectedAll) {
      console.log(selectedAll)
      const listNavigate = this.getNavigate(selectedAll)
      const l = list.create({
        list: listNavigate,
        onclick: (v) => {
          this.selected = v.selected
          this.openEx(ui)
        }
      })
      ui.navigate.content(l)
      ui.navigate.visible(true)
    } else {
      ui.navigate.content('')
      ui.navigate.visible(false)
    }
  }
}

