import './index.css'
import input from '../../../ui/components/input'
import select from '../../../ui/components/select'
import coordinatesHTML from '../../../utils/coordinatesHTML'
import loader from '../../../loader'

export default {
  create(fields, selected, config, result) {
    const form = this.form()
    this.fields(fields, form, result)
    this.config = config
    this.data = {}
    // this.coordinates(coordinates, form)
    this.submit(form, async () => {
      const res = await loader.submit(config.api.updateWells + selected.id + '/', this.data, 'PUT')
    })
    return form
  },
  renderList(list) {
    let html = ''
    list.map(el => {
      const { id, name, index } = el
      html += `<button data-id="${ id }" title="${ name } ${ index ?? '' }">${ name } ${ index ?? '' }</button>`
    })
    return html
  },
  input(el) {
    return input.create({
      value: el.value,
      name: el.name,
      oninput: (e) => {
        this.data[el.name] = e.target.value
      }
      // type: el.type
    })
  },
  select(el, result) {
    const change = (event) => {
      search.setValue(event.target.title)
      this.data[el.name] = +event.target.dataset.id
      search.close()
    }
    const click = async () => {
      const html = this.renderList(result[el.name])
      search.dropdown(html)
    }
    const search = select.create({ name:'search', type:'search', onchange: change, onclick: click })
    search.setValue(el.value)
    return search
  },
  search(el) {
    const change = (event) => {
      // const id = +event.target.dataset.id
      // const model = event.target.dataset.model
      this.data[el.name] = +event.target.dataset.id
      search.setValue(event.target.title)
      search.close()
    }
    const input = async () => {
      const value = search.getValue()
      const data = await loader.query(this.config.search[el.name] + value)
      console.log(data)
      let html = ''
      if (el.name === 'aquifer') {
        html = this.renderList(data.results.map(feature => {
          return { id: feature.id, name: feature.name, index: feature.index  }
        }))
      } else {
        html = this.renderList(data.results.features.map(feature => {
          return { id: feature.id, name: feature.properties.name }
        }))
      }
      search.dropdown(html)
    }
    const search = select.create({ name:'search', type:'search', onchange: change, oninput: input })
    search.setValue(el.value)
    return search
  },
  fields(fields, form, result) {
    const inputs = []
    fields.forEach((el) => {
      const wr = document.createElement('div')
      const label = document.createElement('label')
      label.textContent = el.label
      wr.append(label)
      const field =  this[el.type](el, result)
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