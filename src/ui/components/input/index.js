import './index.css'

export default {
  create({ value, name = '', type = 'text', placeholder = '', oninput }) {
    const el = document.createElement('input')
    el.className = 'mui-input'
    el.name = name
    el.type = type
    el.value = value
    el.oninput = oninput
    return el
  }
}