import Overlay from 'ol/Overlay'
import './index.css'

export default {
  currentCoordinate: null,
  create(map) {
    const { container, content } = this.tooltipElement()
    let tooltip = new Overlay({
      element: container,
      autoPan: false,
      autoPanAnimation: {
        duration: 250
      }
    })
    map.on('pointermove', (event) => this.update(event, map, tooltip, container, content))
    return tooltip
  },
  tooltipElement() {
    const container = document.createElement('div')
    container.className = 'ol-tooltip'
    const content = document.createElement('div')
    content.className = 'tooltip-content'
    container.content = content
    container.appendChild(content)
    return { container, content }
  },
  update(event, map, tooltip, container, content) {
    const features = map.getFeaturesAtPixel(event.pixel)
    if (features?.length > 0) {
      if (features[0].__id === 'measure') return
      const add = (label, text) => text ? `<b>${label}: </b>${text}<br>` : ''
      let tooltipText = ''
      const tooltipSet = []
      features.forEach((feature) => {
        const { model, geometry, name, typo, gvk } = feature.getProperties()
        const type = geometry.getType()
        if (type === 'Point') {
          this.coordinates = geometry.getCoordinates()
          if (!tooltipSet.includes(this.coordinates.toString())) {
            tooltipText += add('Номер', name) + add('Тип', typo?.name) + add('ГВК', gvk || 'Н/Д')
            tooltipSet.push(this.coordinates.toString())
          }
        } else {
          this.coordinates = event.coordinate
          if (model === 'fields') tooltipText += add('Месторождение', name || '-')
          if (model === 'intakes') tooltipText += add('Владелец ВЗУ', name)
          if (model === 'license') tooltipText += add('Номер Лицензии', name)
          if (model === 'section') tooltipText += add('Название линии', name)
        }
      })
      tooltip.setPosition(this.coordinates)
      content.innerHTML = tooltipText
    } else {
      tooltip.setPosition()
    }
  }
}