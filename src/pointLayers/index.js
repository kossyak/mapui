import VectorLayer from 'ol/layer/Vector'
import { pointStyle, labelStyle } from './style'

export default {
  create(pointSource, wells) {
    const layers = {}
    wells.forEach(item => {
      const key = item.key
      layers[key] = new VectorLayer({ source: pointSource[key], style: (feature, resolution) => pointStyle(feature, resolution, item.color) })
      layers[key + 'Label'] = new VectorLayer({ source: pointSource[key], style: labelStyle(), visible: false })
    })
    return layers
  }
}

