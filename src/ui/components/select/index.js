// import './index.css'
import element from '../element'

function debounce(fn, timeout = 120) {
	return function perform(...args) {
		let previousCall = this.lastCall
		this.lastCall = Date.now()
		if (previousCall && this.lastCall - previousCall <= timeout) {
			clearTimeout(this.lastCallTimer)
		}
		this.lastCallTimer = setTimeout(() => fn(...args), timeout)
	}
}

export default {
	create({ parent, name, options, type = 'text', onchange, oninput, onclick }) {
		const render = (list) => dropdown.innerHTML = list || '<i>пусто..</i>'
		const select = element.create({ parent, name })
		const wr = element.create({ parent: select, name: name + '-wr' })
		const input = element.create({ parent: wr, name: name + '-input', tag: 'input' })
		const dropdown = element.create({ parent: wr, name: 'dropdown' })
		dropdown.style.display = 'none'
		render(options)
		input.type = type
		input.onclick = onclick
		input.oninput = (e) => {
			dropdown.style.display = 'grid'
			const value = e.target.value
			if (!value || value.length < 2) return
			debounce(oninput.call(e), 200)
		}
		input.onfocus = () => {
			input.select()
			dropdown.style.display = 'grid'
		}
		input.onblur = (event) => {
			console.log(event)
			const first = event.relatedTarget?.closest('.mui-' + name)
			const second = event.target?.closest('.mui-' + name)
			if (first === second) return
			dropdown.style.display = 'none'
		}
		select.dropdown = render
		select.getValue = () => input.value
		select.setValue = (v) => input.value = v || ''
		select.close = () => dropdown.style.display = 'none'
		dropdown.onclick = (event) => {
			if (!event.target.closest('.mui-dropdown > button')) return
			const id = +event.target.dataset.id
			select.dataset.value = id
			onchange(event)
		}
		select.focus = () => input.focus()
		return select
	}
}