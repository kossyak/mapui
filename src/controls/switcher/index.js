import './style.css'
import tap from '../../ui/components/tap'
import accordion from '../../ui/components/accordion'

export default {
  create(groups, colors) {
    const controls = document.createElement('div')
    controls.className = 'switcher-controls'
    for (const key in groups) {
      const t = tap.create({
        parent: controls,
        text: groups[key].values_.title,
        active: groups[key].values_.visible,
        onclick: (v) => groups[key].setVisible(v)
      })
      t.style.cssText = `--color: rgba(${colors[key]?.color})`
    }
    const a = accordion.create({ text: 'title', active: true })
    a.content(controls)
    return a
  }
}