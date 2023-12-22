export default {
  create({ parent, tag= 'div', name, content, place = 'append' }) {
    const el = document.createElement(tag)
    el.className = 'mui-' + name
    if (content) this.content(el)
    parent && parent[place](el)
    return el
  },
  content(el) {
    const cont = this.create({ parent: el, tag: 'div', name: 'content' })
    el.content = (v) => {
      cont.innerHTML = ''
      v instanceof Element ? cont.append(v) : cont.innerHTML = v || ''
      return cont
    }
    el.addContent = (v) => {
      v instanceof Element ? cont.append(v) : cont.insertAdjacentHTML('beforeEnd', v)
      return cont
    }
  }
}