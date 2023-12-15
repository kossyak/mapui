import './style.css'

export default {
  create(groups, wells) {
    const btns = {}
    const customControls = this.customControls()
    for (const key in groups) {
      const btn = this.btn(groups[key], wells[key])
      if (groups[key].values_.visible) btn.classList.add('active')
      customControls.appendChild(btn)
      btns[key] = btn
    }
    return customControls
  },
  customControls() {
    const customControls = document.createElement('div')
    customControls.className = 'ol-control switcher-controls'
    customControls.hidden = true
    return customControls
  },
  btn(group, well) {
    const btn = document.createElement('button')
    btn.innerHTML = group.values_.title
    btn.title = group.values_.title
    if (well) btn.style.cssText = `--color: rgba(${well.color})`
    btn.addEventListener('click', () => {
      btn.classList.toggle('active')
      group.setVisible(btn.classList.contains('active'))
    })
    return btn
  }
}