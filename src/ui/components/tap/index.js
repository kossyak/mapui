import element from '../element'
import './index.css'

export default {
  create({ parent, html, title, active, onclick }) {
    const el = element.create({ parent, tag: 'button', name: 'tap' })
    el.innerHTML = html || ''
    el.title = title?.replace(/"/g, "'") || ''
    if (active) el.classList.add('active')
    el.addEventListener('click', (event) => {
      const v = onclick(!el.classList.contains('active'), event)
      if (v) return
      el.classList.toggle('active')
    })
    return el
  }
}