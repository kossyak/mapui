import './style.css'

export default {
  create(buttons) {
    const btns = {}
    const customControls = this.customControls()
    for (const key in buttons) {
      const btn = this.btn(buttons[key])
      customControls.appendChild(btn)
      btns[key] = btn
    }
    return customControls
  },
  customControls() {
    const customControls = document.createElement('div')
    customControls.className = 'ol-control menu-controls'
    return customControls
  },
  btn(options) {
    const btn = document.createElement('button')
    btn.innerHTML = options.content
    btn.title = options.title || ''
    btn.className = 'btn'
    btn.onclick = (e) => {
      if (options.toggle) btn.classList.toggle('active')
      const isActive = btn.classList.contains('active')
      options.onclick?.(isActive)
    }
    btn.active = (v) => v ? btn.classList.add('active') : btn.classList.remove('active')
    return btn
  }
}