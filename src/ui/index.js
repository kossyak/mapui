import './index.css'
import './components/arrowIcon/index.css'
import './components/search/index.css'
import element from './components/element'
import select from './components/select'
import list from './components/list'
import filterSearch from '../options/filterSearch'

export default {
  create(target, user, api) {
    target.classList.add('mui')
    target.innerHTML = ''
    const navigate = this.aside(target, 'navigate')
    this.extension(navigate)
    const map = element.create({ parent: target, name: 'map' })
    const search = this.search(target)
    const info = this.aside(target, 'info')
    this.user(info, user, api)
    return { map, navigate, info, search }
  },
  user(info, user, api) {
    const userEl = element.create({ name: 'user' })
    const login = user?.username
    userEl.innerHTML = login ? `<i class="mui-user-icon"></i><span>${login}</span>/<a href="${api.logout}">Выход</a>` : `<a href="${api.login}">Вход</a>`
    info.prepend(userEl)
  },
  search(target) {
    let index = filterSearch.findIndex(e => e.active)
    const input = (event) => {
      const customEvent = new CustomEvent('action', { detail: { value: search.getValue(), tab: filterSearch[index] }})
      search.dispatchEvent(customEvent)
    }
    const change = (event) => {
      const id = +event.target.dataset.id
      const model = event.target.dataset.model
      const customEvent = new CustomEvent('active', { bubbles: true, cancelable: true, detail: { id, model } })
      search.dispatchEvent(customEvent)
    }
    const search = select.create({ parent: target, name:'search', type:'search', onchange: change, oninput: input })
    search.classList.add('searchBar')
    search.on = (event, handler) => search.addEventListener(event, handler, false)

    const tabs = list.create({
      parent: search,
      list: filterSearch,
      name: 'search-tabs',
      onclick: (l, i) => {
        index = i
        input()
        search.focus()
      }
    })
    search.prepend(tabs)
    search.hidden = true
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault()
        search.hidden = false
        search.focus()
      }
    })
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
    ex.getTitle = () => back.children[1].textContent
    ex.contentElement.spinner = (v) => v ? ex.contentElement.classList.add('spinner') : ex.contentElement.classList.remove('spinner')
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