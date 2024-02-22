import VectorLayer from 'ol/layer/Vector'
import { pointStyle, labelStyle } from './style'
import { Style } from 'ol/style'
import filterList from '../options/filterList'

export default {
  wells: [],
  pointSource: {},
  create(pointSource, wells, pointFeatures) {
    this.pointFeatures = pointFeatures
    this.pointSource = pointSource
    this.wells = wells
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
  visibleAquiferPoints(aquifer_index, v, hidden_filters) {
      this.pointFeatures.forEach((feature) => {
        const props = feature.getProperties()
        const aquifer_usage = props.aquifer_usage
        if (aquifer_usage) {
          aquifer_usage.forEach(e => {
            if (e.index === aquifer_index) {
              if (v) {
                if (this.checkFilter(hidden_filters, props)) {
                  feature.setStyle(feature._style)
                  feature._hidden = false
                }
              } else {
                feature.setStyle(new Style({}))
                feature._hidden = true
              }
            }
          })
        } else {
          if (v) {
            if (this.checkFilter(hidden_filters, props)) {
              feature.setStyle(feature._style)
              feature._hidden = false
            }
          } else {
            feature.setStyle(new Style({}))
            feature._hidden = true
          }
        }
      })
  },
  checkFilter(hidden_filters, props) {
    return hidden_filters.size ? !filterList.some(el => hidden_filters.has(el.key) && props[el.key] === 0) : true
  },
  checkAquifers(aquifer_usage, hidden_aquifers) {
    return aquifer_usage ? !aquifer_usage.some(e => hidden_aquifers.has(e.index)) : !hidden_aquifers.has('нд')
  },
  visibleFiltersPoints(k, v, hidden_filters, hidden_aquifers) {
    this.pointFeatures.forEach((feature) => {
      const props = feature.getProperties()
      if (v) {
        if (!props[k]) {
          feature.setStyle(new Style({}))
          feature._hidden = true
        }
      } else {
        if (this.checkFilter(hidden_filters, props) && this.checkAquifers(props.aquifer_usage, hidden_aquifers)) {
          feature.setStyle(feature._style)
          feature._hidden = false
        }
      }
    })
  }
}

