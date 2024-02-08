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
    container.appendChild(content)
    return { container, content }
  },
  update(event, map, tooltip, container, content) {
    const features = map.getFeaturesAtPixel(event.pixel)
    if (features?.length > 0) {
      if (features[0].__id === 'measure') return
      const add = (label, text) => text ? `<b>${label}: </b>${text}<br>` : ''
      let tooltipText = ''
      features.forEach((feature) => {
        const { geometry, name, typo, gvk, field_name, intake_name } = feature.getProperties()
        const type = geometry.getType()
        if (type === 'Point') {
          // if (this.coordinates && this.coordinates === tooltip.getPosition()) return
          this.coordinates = geometry.getCoordinates()
          tooltipText += add('Номер', name) + add('Тип', typo?.name) + add('ГВК', gvk || 'Н/Д')
        } else if (type === 'Polygon' || type === 'MultiPolygon') {
          this.coordinates = event.coordinate
          if (field_name) tooltipText += add('Месторождение', field_name || '-')
          if (intake_name) tooltipText += add('Владелец ВЗУ', intake_name)
        }
        tooltip.setPosition(this.coordinates)
      })
      content.innerHTML = tooltipText
    } else {
      tooltip.setPosition()
    }
  }
}