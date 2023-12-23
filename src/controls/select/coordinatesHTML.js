export default function(c) {
  const list = document.createElement('div')
  list.className = 'coordinate-list'
  list.innerHTML = c.reduce((accum, current, i) => accum + `<div data-index="${i}"><span>${current[0]}</span><span>${current[1]}</span></div>`, '<div class="hr"><span>С.Ш</span><span>В.Д</span></div>')
  return list
}