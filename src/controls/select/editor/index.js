import './index.css'
import input from '../../../ui/components/input'
import select from '../../../ui/components/select'
import coordinatesHTML from '../../../utils/coordinatesHTML'

export default {
  create(fields, coordinates, config) {
    const form = this.form()
    const inputs = this.fields(fields, form)
    this.config = config
    // this.coordinates(coordinates, form)
    this.submit(form, () => {
      const data = {}
      inputs.forEach((input) => data[input.name] = input.value)
      data.coordinates = coordinates
      alert('Данные успешно отправлены ' + JSON.stringify(data))
      // api
    })
    return form
  },
  renderWellTypes() {
    let html = ''
    this.config.wellTypes.map(el => {
      const { id, name } = el
      html += `<button data-id="${ id }" title="${ name }">${ name }</button>`
    })
    return html
  },
  input(el) {
    return input.create({
      value: el.value,
      name: el.name,
      // type: el.type
    })
  },
  select(el) {
    const change = (v) => {
      search.setValue(v.target.title)
      search.close()
    }
    const click = async () => {
      const html = this.renderWellTypes()
      search.dropdown(html)
    }
    const search = select.create({ name:'search', type:'search', onchange: change, onclick: click })
    search.setValue(el.value)
    return search
  },
  search(el) {
    const change = (event) => {
      const id = +event.target.dataset.id
      const model = event.target.dataset.model
      const item = this.config.getFeatureById(id, model)
      search.setValue(item.values_.name)
      search.close()
    }
    const input = async () => {
      const value = search.getValue()
      const html = await this.config.searchResults(value, el.content_types)
      search.dropdown(html)
    }
    const search = select.create({ name:'search', type:'search', onchange: change, oninput: input })
    search.setValue(el.value)
    return search
  },
  fields(fields, form) {
    const inputs = []
    fields.forEach((el) => {
      const wr = document.createElement('div')
      const label = document.createElement('label')
      label.textContent = el.label
      wr.append(label)
      const field =  this[el.type](el)
      inputs.push(field)
      wr.append(field)
      form.append(wr)
    })
    return inputs
  },
  form() {
    const form = document.createElement('div')
    form.className = 'editor'
    return form
  },
  submit(form, onclick) {
    const submit = document.createElement('button')
    submit.className = 'submit'
    submit.textContent = 'Отправить'
    submit.onclick = onclick
    form.append(submit)
    return submit
  },
  panel(inpN, inpE, target, index, coordinates) {
    this.panelEl = null
    this.panelEl = document.createElement('div')
    this.panelEl.className = 'coordinate-panel'
        const reject = document.createElement('button')
    reject.textContent = 'Отмена'
    reject.onclick = () => this.panelEl.remove()
    const apply = document.createElement('button')
    apply.textContent = 'Применить'
    apply.onclick = () => {
      target.children[0].textContent = inpN.value
      target.children[1].textContent = inpE.value
      coordinates[index][0] = +inpN.value
      coordinates[index][1] = +inpE.value
      this.panelEl.remove()
    }
    const wr = document.createElement('div')
    wr.className = 'coordinate-panel-btns'
    wr.append(reject)
    wr.append(apply)
    this.panelEl.append(inpN)
    this.panelEl.append(inpE)
    this.panelEl.append(wr)
  },
  coordinates(coordinates, form) {
    if (coordinates) {
      const list = coordinatesHTML(coordinates)
      list.onclick = (event) => {
        const target = event.target.closest('.coordinate-list > div:not(.coordinate-panel,.hr)')
        if (target) {
          this.panelEl?.remove()
          const index = target.dataset.index
          const inpN = input.create({
            value: coordinates[index][0],
            name: 'N'
          })
          const inpE = input.create({
            value: coordinates[index][1],
            name: 'E'
          })
          this.panel(inpN, inpE, target, index, coordinates)
          target.after(this.panelEl)
        }
      }
      form.append(list)
    }
  }
}