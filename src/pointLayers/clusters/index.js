import { Cluster } from 'ol/source.js'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { clusterStyle } from '../style'

export default {
  create(pointSource, wells, map) {
    const source = new VectorSource({})
    wells.forEach(item => {
      source.addFeatures(pointSource[item.key].getFeatures())
    })
    const clusterSource = new Cluster({
      // distance: parseInt(distanceInput.value, 10), 40
      // minDistance: parseInt(minDistanceInput.value, 10),
      source,
    })
    const styleCache = {}
    return new VectorLayer({
      source: clusterSource,
      style: (feature) => {
        const size = feature.get('features').length
          let style = styleCache[size]
          if (!style) {
            style = clusterStyle(size)
            styleCache[size] = style
          }
          return style
        }
    })
  }
}