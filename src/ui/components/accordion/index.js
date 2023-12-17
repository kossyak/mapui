import element from '../element'
import tap from '../tap'
import './index.css'

export default {
  create({ parent, text, active }) {
    const el = element.create({ parent, tag: 'div', name: 'accordion', content: true })
    const t = tap.create({
      text: text + '<i class="mui-arrow bottom"></i>',
      active,
      onclick: (v) => {
        el.children[1].hidden = !v
      }
    })
    el.prepend(t)
    return el
  }
}