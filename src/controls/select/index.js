import './index.css'
import details from './details'
import editor from './editor'
import tap from '../../ui/components/tap'
import list from '../../ui/components/list'
import { transform } from 'ol/proj'

function combine(original) {
  let n = []
  for (let i = 0; i < original.length; i += 2) {
    n.push(transform([original[i], original[i + 1]], 'EPSG:3857', 'EPSG:4326'))
  }
  return n
}

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
      this.openExtension(ui)
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
  getFields(selected) {
    const { geometry, extra, name, typo, head, intake, field, field_name, intake_name } = selected
    const coordinates = combine(geometry.flatCoordinates)
    selected.__coordinates = coordinates
    const nameGwk = extra?.name_gwk || 'Н/Д'
    if (selected.type === 'wells') {
      return [
        { label: 'Номер ГВК', value: nameGwk, type: 'number', name: 'n1' },
        { label: 'Внутренний номер', value: name, type: 'number', name: 'n2'  },
        { label: 'Тип', value: typo, name: 'n3'  },
        { label: 'А.О. устья', value: head, name: 'n4'  },
        { label: 'Водозабор', value: intake, name: 'n5'  },
        { label: 'Месторождение', value: field, name: 'n6'  },
        // { label: 'С.Ш', value: coordinates[0][0], type: 'number', name: 'n7'  },
        // { label: 'В.Д', value: coordinates[0][1], type: 'number', name: 'n8'  },
      ]
    } else if (selected.type === 'fields') {
      return [{ label: 'Наименование', value: field_name, name: 'n9'  }]
    } else if (selected.type === 'VZU') {
      return [{ label: 'Владелец', value: intake_name, name: 'n10'  }]
    }
  },
  fieldsToHTML(fields) {
    let html = '<div class="info-text">'
    const add = (label, text) => text ? `<div><span>${label}: </span><b>${text}</b></div>` : ''
    fields.forEach((el) => html += add(el.label, el.value))
    return html + '</div>'
  },
  getNavigate(selectedAll) {
    const list = []
    selectedAll.forEach((s) => {
      const selected = s.getProperties()
      const { extra, name, typo, field_name, intake_name } = selected
      const nameGwk = extra?.name_gwk || 'Н/Д'
      const add = (label, text) => `<div><span>${label}: </span>${text || '-'}</div>`
      let type = {
        key: 'wells',
        title: add('Номер', name || 'б/н') + add('Номер ГВК', nameGwk) + add('Тип', typo)
      }
      if (intake_name) type = {
        key: 'VZU',
        title: add('Тип', 'Водозаборы') + add('Владелец', intake_name)
      }
      if (field_name) type = {
        key: 'fields',
        title: add('Тип', 'Месторождения') + add('Наименование', field_name)
      }
      selected.type = type.key
      list.push({ selected, title: type.title })
    })
    return list
  },
  openExtension(ui) {
    const fields = this.getFields(this.selected)
    const editBtn = tap.create({
      html: 'Редактировать <i>✎</i>',
      onclick: (v) => {
        const form = editor.create(fields, this.selected.__coordinates)
        ui.navigate.extension.content(form)
        ui.navigate.extension.setTitle('Редактирование')
      }
    })
    const html = this.fieldsToHTML(fields)
    ui.navigate.extension.content(editBtn)
    ui.navigate.extension.addContent(html)
    const type = this.selected.type
    const listEx = list.create({
      list: details[type],
      onclick: (item, index) => {
        ui.navigate.extension.setTitle(item.title)
        const content = details[type][index].view?.(this.selected)
        if (content) ui.navigate.extension.content(content)
      }
    })
    ui.navigate.extension.addContent(listEx)
  },
  update(event, select, infoPanel, ui) {
    ui.navigate.extension.content('')
    const selectedAll = select.getFeatures().getArray()
    if (selectedAll) {
      const listNavigate = this.getNavigate(selectedAll)
      const l = list.create({
        list: listNavigate,
        onclick: (v) => {
          this.selected = v.selected
          this.openExtension(ui)
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

