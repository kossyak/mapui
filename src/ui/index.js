import './index.css'

export default {
  create(target) {
    target.classList.add('mapui')
    const navigate = this.element(target, 'aside', 'navigate')
    const map = this.element(target, 'div', 'map')
    const info = this.element(target, 'aside', 'info')
    this.listener(navigate)
    this.listener(info)
    return { map, navigate, info }
  },
  element(target, tag, name) {
    const el = document.createElement(tag)
    el.className = 'ui-' + name
    target.append(el)
    return el
  },
  listener(el) {
    Object.defineProperty(el, 'visible', {
      set: (v) => v ? el.setAttribute('visible', '') : el.removeAttribute('visible', '')
    })
  }
}