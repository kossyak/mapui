import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'

export default {
  getFeatures(typo, points) {
    const features = points.filter(item => item.properties.typo.id === typo) || []
    return {type: 'FeatureCollection', crs: {type: 'name', properties: {name: 'EPSG:4326'}}, features}
  },
  getSource(typo, points) {
    const features = new GeoJSON().readFeatures(this.getFeatures(typo, points), {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    const source = new VectorSource({
      // url: 'app/map/points',
      // format: new GeoJSON(),
      wrapX: true,
      features
    })
    return { source, features }
  },
  getPointSource(wells, points) {
    const wellsSource = {}
    const wellsFeatures = []
    wells.forEach(item => {
      const { source, features } = this.getSource(item.typo, points)
      wellsSource[item.key] = source
      wellsFeatures.push(...features)
    })
    return { wellsSource, wellsFeatures }
  }
}