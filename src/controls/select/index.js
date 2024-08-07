import './index.css'
import details from './details'
import editor from './editor'
import tap from '../../ui/components/tap'
import list from '../../ui/components/list'
import mapping from '../../utils/mapping'
import ms from '../../microservice'
import models from '../../options/models'

export default {
  selected: {},
  selectedAll: [],
  config: {},
  create(ui, config, pointActive, select, result) {
    this.select = select
    this.config = config
    this.pointActive = pointActive
    const infoPanel = this.infoElement()
    ui.navigate.classList.add('info')
    const exportBtn = tap.create({
      html: `Экспорт ⤇`,
      onclick: (v) => {
        const iframe = ms({
          url: config.services.export(),
          entry: {
            data: this.selectedAll,
            models: models,
            config // remove
          },
          config
        })
        ui.navigate.extension.setTitle('Экспорт')
        ui.navigate.extension.content(iframe)
        return true
      }
    })
    ui.navigate.append(exportBtn)
    ui.navigate.on('back', () => {
      if (ui.navigate.extension.getTitle()) {
        ui.navigate.extension.setTitle('')
        this.openExtension(ui, result)
      } else {
        ui.navigate.extension.content('')
      }
      ui.navigate.extension.contentElement.spinner(false)
    })
    return { infoPanel, update: () => this.update(infoPanel, ui, result) }
  },
  infoElement() {
    const container = document.createElement('div')
    container.className = 'ol-control info-panel'
    container.hidden = true
    return container
  },
  getFields(selected) {
    const { model, gvk, name, typo, intake, field, aquifer_usage } = selected
    if (model === 'wells') {
      return [
        { label: 'Номер ГВК', value: gvk, type: 'input', name: 'gvk' },
        { label: 'Внутренний номер', value: name, type: 'input', name: 'name' },
        { label: 'Тип', value: typo?.name, type: 'select', name: 'typo' },
        { label: 'Водозабор', value: intake?.name, type: 'search', name: 'intake', content_types: '28' },
        { label: 'Месторождение', value: field?.name, type: 'search', name: 'field', content_types: '27' },
        { label: 'Целевой горизонт', value: aquifer_usage?.map(el => el.name), type: 'search', name: 'aquifer', content_types: '' }
      ]
    } else if (model === 'fields') {
      return [{ label: 'Наименование', value: name, type: 'input', name: 'name' }]
    } else if (model === 'intakes') {
      return [{ label: 'Владелец', value: name, type: 'input', name: 'name' }]
    } else if (model === 'license') {
      const { name, gw_purpose, department } = selected
      return [
        { label: 'Номер', value: name, type: 'input', name: 'name' },
        { label: 'Назначение', value: gw_purpose, type: 'textarea', name: 'gw_purpose'  },
        // { label: 'Орган выдачи', value: department?.name, name: 'n9'  },
      ]
    } else if (model === 'section') {
      const { name, type_section, type_sediment } = selected
      return [
        { label: 'Название', value: name, type: 'input', name: 'name' },
        { label: 'Тип разреза', value: type_section.name, type: 'select', name: 'type_section'  },
        { label: 'Тип отложений', value: type_sediment.name, type: 'select', name: 'type_sediment'  },
      ]
    }
  },
  fieldsToHTML(fields) {
    let html = '<div class="info-text">'
    const add = (label, text) => text ? `<div><span>${label}: </span><b>${text}</b></div>` : ''
    fields.forEach((el) => html += add(el.label, el.value))
    return html + '</div>'
  },
  getNavigate(selectedArr) {
    const list = []
    this.selectedAll = []
    selectedArr.forEach((s) => {
      const selected = mapping(s)
      this.selectedAll.push(selected)
      const add = (label, text) => text ? `<div><span>${label}: </span>${text || '-'}</div>` : ''
      const { model, gvk, name, typo, aquifer_usage, type_section, type_sediment } = selected
      let title = ''
      if (model === 'wells') title = add('Номер', name || 'б/н') + add('Номер ГВК', gvk || 'Н/Д') + add('Тип', typo?.name) + add('Горизонт', aquifer_usage?.map(el => el.index))
      if (model === 'intakes') title = add('Тип', 'Водозаборы') + add('Владелец', name)
      if (model === 'fields') title =  add('Тип', 'Месторождения') + add('Наименование', name)
      if (model === 'license') title =  add('Тип', 'Лицензия') + add('Номер', name)
      if (model === 'section') title = add('Название', name) + add('Тип разреза', type_section.name) + add('Тип отложений', type_sediment.name)
      list.push({ selected, title })
    })
    return list
  },
  openExtension(ui, result) {
    const fields = this.getFields(this.selected)
    const editBtn = tap.create({
      html: 'Редактировать <i>✎</i>',
      disabled: true, // !
      onclick: (v) => {
        const form = editor.create(fields, this.selected, this.config, result)
        ui.navigate.extension.content(form)
        ui.navigate.extension.setTitle('Редактирование')
      }
    })
    if (this.config.user?.permission?.includes(2)) editBtn.disabled = false // !
    ui.navigate.extension.content(editBtn)
    const html = this.fieldsToHTML(fields)
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
          ui.navigate.extension.content(content)
          if (content.tagName === 'IFRAME') {
            content.parentElement.classList.add('spinner')
          }
        }
      }
    })
    ui.navigate.extension.addContent(listEx)
  },
  update(infoPanel, ui, result) {
    const selectedArr = this.select.getFeatures().getArray()
    // ui.navigate.extension.content('')
    console.log(2)
    if (selectedArr?.length) {
      const listNavigate = this.getNavigate(selectedArr)
      const l = list.create({
        list: listNavigate,
        onclick: (v) => {
          this.selected = v.selected
          this.openExtension(ui, result)
          if (!v.selected.geometry) return
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

