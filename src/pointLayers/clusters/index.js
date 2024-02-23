import { Cluster } from 'ol/source.js'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { clusterStyle } from '../style'
import GeoJSON from 'ol/format/GeoJSON'

export default {
  create(wells, points) {
    const features = new GeoJSON().readFeatures({
        type: 'FeatureCollection',
        crs: {type: 'name', properties: {name: 'EPSG:4326'}},
        features:points
      }, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    
    const source = new VectorSource({ features })
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