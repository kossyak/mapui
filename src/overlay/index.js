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
    if (features?.length === 1 && features[0].__id === 'measure') return
    if (features?.length > 0) {
      const add = (label, text) => text ? `<b>${label}: </b>${text}<br>` : ''
      let tooltipText = ''
      features.forEach((feature) => {
        const { geometry, name, typo, extra, field_name, intake_name } = feature.getProperties()
        const type = geometry.getType()
        if (type === 'Point') {
          // if (this.coordinates && this.coordinates === tooltip.getPosition()) return
          this.coordinates = geometry.getCoordinates()
          const nameGwk = extra?.name_gwk || 'Н/Д'
          tooltipText += add('Номер', name) + add('Тип', typo) + add('ГВК', nameGwk)
        } else if (type === 'Polygon' || type === 'MultiPolygon') {
          this.coordinates = event.coordinate
          tooltipText += add('Месторождение', field_name || '-') + add('Владелец ВЗУ', intake_name)
        }
        tooltip.setPosition(this.coordinates)
      })
      content.innerHTML = tooltipText
    } else {
      tooltip.setPosition()
    }
  }
}