import './index.css'
import './components/arrowIcon/index.css'
import './components/search/index.css'
import element from './components/element'

export default {
  create(target) {
    target.classList.add('mui')
    target.innerHTML = ''
    const navigate = this.aside(target, 'navigate')
    this.extension(navigate)
    const map = element.create({ parent: target, name: 'map' })
    const search = this.search(target)
    const info = this.aside(target, 'info')
    return { map, navigate, info, search }
  },
  debounce(func, ms) {
    let timeout;
    return function() {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, arguments), ms)
    }
  },
  search(target) {
    const search = element.create({ parent: target, name: 'search' })
    const input = element.create({ parent: search, name: 'search-input', tag: 'input' })
    const dropdown = element.create({ parent: search, name: 'dropdown' })
    input.type = 'search'
    search.on = (event, handler) => search.addEventListener(event, handler, false)
    input.oninput = this.debounce((event) => {
        const customEvent = new CustomEvent('change', { detail: {value: event.target.value }})
        search.dispatchEvent(customEvent)
    }, 200)
    input.onfocus = () => {
      dropdown.style.display = 'grid'
    }
    input.onblur = () => {
      dropdown.style.display = 'none'
    }
    search.dropdown = (list) => {
      dropdown.innerHTML = list.reduce((accum, current) => accum + `<button data-id="${current.id}" data-model="${current.model}">${current.label}</button>`, '')
    }
    dropdown.onmousedown = (event) => {
      const id = +event.target.dataset.id
      const model = event.target.dataset.model
      const customEvent = new CustomEvent('select', { bubbles: true, cancelable: true, detail: { id, model } })
      search.dispatchEvent(customEvent)
    }
    return search
  },
  aside(target, name) {
    const el = element.create({ parent: target, tag: 'aside', name, content: true })
    el.on = (event, handler) => el.addEventListener(event, handler, false)
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