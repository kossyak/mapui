import './index.css'
import element from '../element'

export default {
  create({ list, onclick }) {
    const el = element.create({ tag: 'div', name: 'list' })
    el.innerHTML = this.content(list)
    el.onclick = (event) => {
      const target = event.target.closest('.mui-li')
      if (target) {
        const prev = target.parentNode.querySelector('.active')
        prev?.classList.remove('active')
        target.classList.add('active')
        const index = +target.dataset.index - 1
        onclick?.(list[index], index, target, event)
      }
    }
    return el
  },
  content(list) {
    return list.reduce((accum, current, i) => accum + `<button class="mui-li" data-index="${i + 1}" ${current.disabled ? 'disabled' : ''}><div>${current.title}</div><i class="mui-arrow right"></i></button>`, '')
  }
}