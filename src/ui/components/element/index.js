export default {
  create({ parent, tag, name, content, place = 'append' }) {
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
      if (typeof v === 'string') cont.innerHTML = v || ''
      if (v instanceof Element) cont.append(v)
    }
  }
}