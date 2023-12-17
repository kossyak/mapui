import './style.css'
import tap from '../../ui/components/tap'
import accordion from '../../ui/components/accordion'

export default {
  create(options) {
    const controls = document.createElement('div')
    options.forEach((item) => {
      const div = document.createElement('div')
      div.className = 'switcher-controls'
      item.children?.forEach(child => {
        const t = tap.create({
          parent: div,
          text: child.title,
          active: child.visible,
          onclick: child.onclick
        })
        t.style.cssText = `--color: rgba(${child.color || [255, 255, 255, 0.21]})`
      })
      const a = accordion.create({ text: item.title, active: item.visible })
      a.content(div)
      controls.append(a)
    })
    return controls
  }
}