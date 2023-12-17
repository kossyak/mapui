import element from '../element'
import './index.css'

export default {
  create({ parent, text, title, active, onclick }) {
    const el = element.create({ parent, tag: 'button', name: 'tap' })
    el.innerHTML = text || ''
    el.title = title || text || ''
    if (active) el.classList.add('active')
    el.addEventListener('click', () => {
      el.classList.toggle('active')
      onclick(el.classList.contains('active'))
    })
    return el
  }
}