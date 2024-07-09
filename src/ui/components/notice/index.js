import element from '../element'
import './index.css'

export default {
  create({ parent, html, id, type }) {
    const el = element.create({ parent, name: 'notice' })
    el.classList.add(`notice-${ type || 'success' }`)
    el.dataset.id = id
    el.innerHTML = `<div>${ html }</div><div class="notice-close" data-id="${ id }">✕</div>`
    return el
  },
  init({ target, delay = 5000 }) {
    this.notifications = []
    this.container = document.createElement('div')
    this.container.classList.add('mui-notice-container')
    target.appendChild(this.container)
    this.delay = delay
    if (!this.container) {
      console.error('Notification container not found. Please add an element with id "container" to your HTML.')
      return
    }
    this.container.addEventListener('click', (event) => {
      const target = event.target.closest('.notice-close')
      if (target) this.remove(target.dataset.id)
    })
  },
  add({ type, content }) {
    const id = new Date().getTime()
    this.notifications.push({ id, type, content })
    this.create({ parent: this.container, html: content, id, type })
    setTimeout(() => this.remove(id), this.delay)
  },
  remove(id) {
    const index = this.notifications.findIndex(n => n.id === id)
    if (index !== -1) this.notifications.splice(index, 1)
    const target = document.querySelector(`.mui-notice[data-id="${ id }"]`)
    if (target) this.container.removeChild(target)
  }
}