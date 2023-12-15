import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import points from './points.json'

export default {
  getFeatures(typo) {
    const features = points.features.filter(item => item.properties.typo === typo)
    return {type: 'FeatureCollection', crs: {type: 'name', properties: {name: 'EPSG:4326'}}, features}
  },
  getSource(typo) {
    const features = new GeoJSON().readFeatures(this.getFeatures(typo), {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    return new VectorSource({
      // url: 'app/map/points',
      // format: new GeoJSON(),
      wrapX: true,
      features
    })
  },
  getPointSource(wells) {
    const pointSource = {}
    for (const key in wells) {
      pointSource[key] = this.getSource(wells[key].typo)
    }
    return pointSource
  }
}