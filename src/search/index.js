import switcher from '../options/switcher'

export default {
  render(data, result) {
    let html = ''
    data.results.map(el => {
      const id = el.object_id
      const model = el.model
      const item = result[model + 'Json']?.find(o => o.id === id)
      const { color, label, name } = this[model]?.(item)
      html += `<button data-id="${id}" name="${name}" data-model="${model}" title="${label?.replace(/"/g, "'")}" style="--color: ${color};">${label || 'н/д' }</button>`
    })
    return html
  },
  wells(item) {
    const { name, typo, gvk, intake, field } = item.properties
    const label = [name, typo.name, gvk, intake?.name || 'н/д', field?.properties.name || 'н/д'].join(', ')
    const color = typo.color
    return { color, label, name: 'wells' }
  },
  intakes(item) {
    const { name } = item.properties
    const label = [name].join(', ')
    const color = switcher[1].children[1].color
    return { color, label, name: 'polygons' }
  },
  fields(item) {
    const { name } = item.properties
    const label = [name].join(', ')
    const color = switcher[1].children[0].color
    return { color, label, name: 'polygons' }
  },
  license(item) {
    const { name, gw_purpose, department } = item.properties
    const label = [name, gw_purpose, department?.name ].join(', ')
    const color = switcher[1].children[2].color
    return { color, label, name: 'polygons' }
  }
}