import './index.css'

export default {
  create({ value, name = '', placeholder = '', maxLength , oninput }) {
    const el = document.createElement('textarea')
    el.className = 'mui-textarea'
    el.name = name
    el.maxLength = maxLength || 200
    el.value = value
    el.placeholder = placeholder
    el.onkeyup = (event) => {
      const field = event.target
      if (field.scrollHeight > field.clientHeight) {
        field.style.height = `${field.scrollHeight}px`
      }
      oninput(event)
    }
    return el
  }
}