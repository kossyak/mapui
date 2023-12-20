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
    if (features && features.length > 0) {
      let tooltipText = '<b>Краткая информация:</b><br>'
      features.forEach((feature) => {
        const type = feature.getGeometry().getType()
        if (type === 'Point') {
          // if (this.coordinates && this.coordinates === tooltip.getPosition()) return
          this.coordinates = feature.getGeometry().getCoordinates()
          const extra = feature.get('extra')
          const nameGwk = extra?.name_gwk || 'Н/Д'
          tooltipText += '<b>Номер:</b> ' + feature.get('name') + '<br>' +
            '<b>Тип:</b> ' + feature.get('typo') + '<br>' +
            '<b>ГВК:</b> ' + nameGwk + '<br>'
        } else if (type === 'Polygon' || type === 'MultiPolygon') {
          this.coordinates = event.coordinate
          const properties = feature.getProperties()
          if ('field_name' in properties) {
            tooltipText += '<b>Месторождение:</b> ' + (feature.get('field_name') || '-') + '<br>'
          } else if ('intake_name' in properties) {
            tooltipText += '<b>Владелец ВЗУ:</b> ' + feature.get('intake_name') + '<br>'
          }
        }
        tooltip.setPosition(this.coordinates)
      })
      content.innerHTML = tooltipText
    } else {
      tooltip.setPosition()
    }
  }
}