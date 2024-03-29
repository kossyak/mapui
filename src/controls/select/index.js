import './index.css'
import details from './details'
import editor from './editor'
import tap from '../../ui/components/tap'
import list from '../../ui/components/list'
import mapping from '../../utils/mapping'
import MS from '../../microservice'
import models from '../../options/models'
import LogicalNary from "ol/format/filter/LogicalNary";

export default {
  selected: {},
  selectedAll: [],
  config: {},
  create(ui, config, pointActive) {
    this.config = config
    this.pointActive = pointActive
    const infoPanel = this.infoElement()
    ui.navigate.classList.add('info')
    const exportBtn = tap.create({
      html: `Экспорт ⤇`,
      onclick: (v) => {
        const ms = new MS({
          url: config.services.export(),
          entry: {
            data: this.selectedAll,
            models: models,
            config
          }
        })
        ui.navigate.extension.setTitle('Экспорт')
        ui.navigate.extension.content(ms.iframe)
        return true
      }
    })
    ui.navigate.append(exportBtn)
    ui.navigate.on('back', () => {
      ui.navigate.extension.setTitle('')
      this.openExtension(ui)
    })
    return { infoPanel, update: (select) => this.update(select, infoPanel, ui) }
  },
  infoElement() {
    const container = document.createElement('div')
    container.className = 'ol-control info-panel'
    container.hidden = true
    return container
  },
  getFields(selected) {
    const { model, gvk, name, typo, head, intake, field, aquifer_usage, field_name, intake_name } = selected
    if (model === 'wells') {
      return [
        { label: 'Номер ГВК', value: gvk, type: 'number', name: 'n1' },
        { label: 'Внутренний номер', value: name, type: 'number', name: 'n2'  },
        { label: 'Тип', value: typo?.name, name: 'n3'  },
        { label: 'А.О. устья', value: head, name: 'n4'  },
        { label: 'Водозабор', value: intake?.name, name: 'n5'  },
        { label: 'Месторождение', value: field?.name, name: 'n6'  },
        { label: 'Целевой горизонт', value: aquifer_usage?.map(el => el.name), name: 'n7'  },
        // { label: 'С.Ш', value: coordinates[0][0], type: 'number', name: 'n7'  },
        // { label: 'В.Д', value: coordinates[0][1], type: 'number', name: 'n8'  },
      ]
    } else if (model === 'fields') {
      return [{ label: 'Наименование', value: field_name, name: 'n9'  }]
    } else if (model === 'intakes') {
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
    this.selectedAll = []
    selectedAll.forEach((s) => {
      const selected = mapping(s)
      this.selectedAll.push(selected)
      const add = (label, text) => text ? `<div><span>${label}: </span>${text || '-'}</div>` : ''
      const { model, gvk, name, typo, aquifer_usage, field_name, intake_name } = selected
      let title = ''
      if (model === 'wells') title = add('Номер', name || 'б/н') + add('Номер ГВК', gvk || 'Н/Д') + add('Тип', typo?.name) + add('Горизонт', aquifer_usage?.map(el => el.index))
      if (model === 'intakes') title = add('Тип', 'Водозаборы') + add('Владелец', intake_name)
      if (model === 'fields') title =  add('Тип', 'Месторождения') + add('Наименование', field_name)
      list.push({ selected, title })
    })
    return list
  },
  openExtension(ui) {
    const fields = this.getFields(this.selected)
    const editBtn = tap.create({
      html: 'Редактировать <i>✎</i>',
      onclick: (v) => {
        const form = editor.create(fields, this.selected.coordinates)
        ui.navigate.extension.content(form)
        ui.navigate.extension.setTitle('Редактирование')
      }
    })
    const html = this.fieldsToHTML(fields)
    ui.navigate.extension.content(editBtn)
    ui.navigate.extension.addContent(html)
    details[this.selected.model].forEach((el) => {
      if (el.key) el.disabled = !Boolean(this.selected[el.key])
    })
    const listEx = list.create({
      list: details[this.selected.model],
      onclick: (item, index) => {
        ui.navigate.extension.setTitle(item.title)
        const content = details[this.selected.model][index].view?.(this.selected, this.config)
        if (content) {
          if (content.tagName === 'IFRAME') {
            ui.navigate.extension.classList.add('spinner')
            content.addEventListener('load', () => {
              ui.navigate.extension.classList.remove('spinner')
            }, true)
          }
          ui.navigate.extension.content(content)
        }
      }
    })
    ui.navigate.extension.addContent(listEx)
  },
  update(selectedAll, infoPanel, ui) {
    ui.navigate.extension.content('')
    if (selectedAll?.length) {
      const listNavigate = this.getNavigate(selectedAll)
      const l = list.create({
        list: listNavigate,
        onclick: (v) => {
          this.selected = v.selected
          this.openExtension(ui)
          const coordinates = v.selected.geometry.getCoordinates()
          this.pointActive.move(coordinates)
        }
      })
      ui.navigate.content(l)
      ui.navigate.visible(true)
    } else {
      ui.navigate.content('')
      ui.navigate.visible(false)
      this.pointActive.remove()
    }
  }
}

