import './style.css'
import tap from '../../ui/components/tap'
import accordion from '../../ui/components/accordion'

export default {
  create(options, groups) {
    const controls = document.createElement('div')
    controls.className = 'switcher-controls'
    options.forEach((item) => {
      const a = accordion.create({ text: item.title, active: item.visible })
      item.children?.forEach(child => {
        const t = tap.create({
          // parent: div,
          multiply: true,
          html: child.title,
          active: groups[child.key].getVisible(),
          onclick: (v) => {
            child.visible = v
            groups[child.key].setVisible(v)
          }
        })
        t.style.cssText = `--color: rgba(${child.color || [255, 255, 255, 0.21]})`
        a.addContent(t)
      })
      controls.append(a)
    })
    return controls
  }
}