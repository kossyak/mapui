import './index.css'
import element from '../element'

export default {
  create({ parent, list, name, onclick, place= 'append' }) {
    console.log(list)
    const el = element.create({ tag: 'div', name: name || 'list' })
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
    parent && parent[place](el)
    return el
  },
  content(list) {
    return list.reduce((accum, current, i) => accum + `<button class="mui-li${current.active ? ' active' : ''}" data-index="${i + 1}" ${current.disabled ? 'disabled' : ''}><div>${current.title}</div><i class="mui-arrow right"></i></button>`, '')
  }
}