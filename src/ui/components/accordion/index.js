import element from '../element'
import tap from '../tap'
import './index.css'

export default {
  create({ parent, text, active, name }) {
    const el = element.create({ parent, tag: 'div', name: 'accordion' })
    name && el.setAttribute('name', name)
    const wr = element.create({ parent: el, tag: 'div', name: 'wrapper', content: true })
    const t = tap.create({
      html: `<span>${text}</span><i class="mui-arrow"></i>`,
      title: text,
      active,
      onclick: (v) => {
        wr.hidden = !v
      }
    })
    el.prepend(t)
    wr.hidden = !active
    el.content = wr.content
    el.addContent = wr.addContent
    return el
  }
}