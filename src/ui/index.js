import './index.css'
import './components/arrowIcon/index.css'
import element from './components/element'

export default {
  create(target) {
    target.classList.add('mui')
    const navigate = this.aside(target, 'navigate')
    const map = element.create({ parent: target, tag: 'div', name: 'map' })
    const info = this.aside(target, 'info')
    return { map, navigate, info }
  },
  aside(target, name) {
    const el = element.create({ parent: target, tag: 'aside', name, content: true })
    el.on = (event, handlers) => document.addEventListener(event, handlers, false)
    this.close(el)
    this.visible(el)
    return el
  },
  visible(el) {
    el.visible = (v) => v ? el.setAttribute('visible', '') : el.removeAttribute('visible', '')
    // Object.defineProperty(el, 'visible', {
    //   set: (v) => v ? el.setAttribute('visible', '') : el.removeAttribute('visible', '')
    // })
  },
  close(el) {
    const close = element.create({ parent: el, tag: 'div', name: 'close', place: 'prepend' })
    close.innerHTML = '<i class="mui-arrow right"></i>'
    close.onclick = () => {
      let event = new Event('close', { bubbles: true, cancelable: true })
      el.dispatchEvent(event)
      el.visible(false)
    }
  }
}