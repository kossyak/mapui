import VectorLayer from 'ol/layer/Vector'
import { pointStyle, labelStyle } from './style'
import { Style } from 'ol/style'

export default {
  wells: [],
  pointSource: {},
  create(pointSource, wells, hidden_aquifers) {
    this.pointSource = pointSource
    this.wells = wells
    this.hidden_aquifers = hidden_aquifers
    const layers = {}
    wells.forEach(item => {
      const key = item.key
      layers[key] = new VectorLayer({ source: pointSource[key], style: (feature) => {
          const prop = feature.getProperties()
          const aquifer_usage = prop.aquifer_usage
          return pointStyle(feature, aquifer_usage?.[0]?.color, prop.typo?.color)
        }
      })
      layers[key + 'Label'] = new VectorLayer({ source: pointSource[key], style: labelStyle(), visible: false })
    })
    return layers
  },
  visibleAquiferPoints(aquifer_index, v) {
    this.wells.forEach(item => {
      const key = item.key
      this.pointSource[key].getFeatures().forEach((feature) => {
        const prop = feature.getProperties()
        const aquifer_usage = prop.aquifer_usage
        aquifer_usage?.forEach(e => {
          if (e.index === aquifer_index) {
            v ? feature.setStyle(pointStyle(feature, e.color, prop.typo.color)) : feature.setStyle(new Style({}))
            feature._hidden = !v
          }
        })
      })
    })
  }
}

