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
          feature._style = pointStyle(feature, aquifer_usage?.[0]?.color, prop.typo?.color)
          return feature._style
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
        if (aquifer_usage) {
          aquifer_usage.forEach(e => {
            if (e.index === aquifer_index) {
              v ? feature.setStyle(feature._style) : feature.setStyle(new Style({}))
              feature._hidden = !v
            }
          })
        } else {
          v ? feature.setStyle(pointStyle(feature, '#ffffff', prop.typo.color)) : feature.setStyle(new Style({}))
          feature._hidden = !v
        }
      })
    })
  },
  visibleFiltersPoints(k, v) {
    this.wells.forEach(item => {
      const key = item.key
      this.pointSource[key].getFeatures().forEach((feature) => {
        const prop = feature.getProperties()
        if (v) {
          if (!prop[k]) {
            feature.setStyle(new Style({}))
            feature._hidden = !v
          } else {
            feature.setStyle(feature._style)
            feature._hidden = !v
          }
        } else {
          feature.setStyle(feature._style)
          feature._hidden = !v
        }
      })
    })
  }
}

