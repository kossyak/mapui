import './index.css'
import input from '../../../ui/components/input'
import coordinatesHTML from '../../../utils/coordinatesHTML'

export default {
  create(fields, coordinates) {
    const form = this.form()
    const inputs = this.fields(fields, form)
    this.coordinates(coordinates, form)
    this.submit(form, () => {
      const data = {}
      inputs.forEach((input) => data[input.name] = input.value)
      data.coordinates = coordinates
      alert('Данные успешно отправлены ' + JSON.stringify(data))
      // api
    })
    return form
  },
  fields(fields, form) {
    const inputs = []
    fields.forEach((el) => {
      const wr = document.createElement('div')
      const label = document.createElement('label')
      label.textContent = el.label
      wr.append(label)
      const inp = input.create({
        value: el.value,
        name: el.name,
        type: el.type
      })
      inputs.push(inp)
      wr.append(inp)
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