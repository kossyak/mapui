import './index.css'
import './components/arrowIcon/index.css'
import element from './components/element'

export default {
  create(target) {
    target.classList.add('mui')
    const navigate = this.aside(target, 'navigate')
    this.extension(navigate)
    const map = element.create({ parent: target, name: 'map' })
    const info = this.aside(target, 'info')
    return { map, navigate, info }
  },
  aside(target, name) {
    const el = element.create({ parent: target, tag: 'aside', name, content: true })
    el.on = (event, handlers) => el.addEventListener(event, handlers, false)
    const direction = name === 'navigate' ? 'left' : 'right'
    this.close(el, direction)
    this.visible(el)
    return el
  },
  extension(navigate) {
    const ex = element.create({ parent: navigate, name: 'extension', content: true })
    navigate.on('close', () => {
      ex.content('')
      ex.classList.remove('full')
    })
    const topbar = element.create({ parent: ex, name: 'topbar', place: 'prepend' })
    const back = element.create({ parent: topbar, name: 'back'})
    const full = element.create({ parent: topbar, name: 'full'})
    back.innerHTML = `<i class="mui-arrow left"></i><div></div>`
    back.onclick = () => {
      const event = new CustomEvent('back', { bubbles: true, cancelable: true })
      navigate.dispatchEvent(event)
    }
    full.onclick = () => {
      const event = new CustomEvent('full', { bubbles: true, cancelable: true })
      navigate.dispatchEvent(event)
      ex.classList.toggle('full')
    }
    ex.setTitle = (v) => back.children[1].textContent = v
    navigate.extension = ex
    return ex
  },
  visible(el) {
    el.visible = (v) => v ? el.setAttribute('visible', '') : el.removeAttribute('visible', '')
    // Object.defineProperty(el, 'visible', {
    //   set: (v) => v ? el.setAttribute('visible', '') : el.removeAttribute('visible', '')
    // })
  },
  close(el, direction) {
    const close = element.create({ parent: el, name: 'close', place: 'prepend' })
    close.innerHTML = `<i class="mui-arrow ${direction}"></i>`
    close.onclick = () => {
      const event = new CustomEvent('close', { bubbles: true, cancelable: true })
      el.dispatchEvent(event)
      el.visible(false)
    }
  }
}