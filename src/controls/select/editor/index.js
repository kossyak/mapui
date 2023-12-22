import './index.css'
import input from '../../../ui/components/input'

export default {
  create(fields) {
    const form = this.form()
    const inputs = this.fields(fields, form)
    this.submit(form, () => {
      const data = {}
      inputs.forEach((input) => data[input.name] = input.value)
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
  }
}