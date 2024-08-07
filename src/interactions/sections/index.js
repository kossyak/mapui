import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Modify from 'ol/interaction/Modify'
import { transform } from "ol/proj"
import { Stroke, Style } from 'ol/style'
import GeoJSON from 'ol/format/GeoJSON'

export default {
  create({ type, featuresJSON = [], style }) {
    const features = new GeoJSON().readFeatures({
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:4326'
        }
      }, features: featuresJSON }, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    const source = new VectorSource({ features })
    const layer = new VectorLayer({
      source: source,
      style: (feature) => this.polygonStyle(style, feature)
    })
    const interaction = this.addModify(layer, type)
    return { layer, features, interaction }
  },
  addModify(layer, type) {
    const interaction = new Modify({
      source: layer.getSource(),
      modifyend: (event) => this.handleModifyEnd(event, type)
    })
    interaction.setActive(false)
    return interaction
  },
  polygonStyle(style, feature) {
    if (style) {
      const { type_section } = feature.getProperties()
      return new Style({
        stroke: new Stroke({
          color: type_section.color || style.strokeColor,
          width: 2
        })
      })
    } else return {}
  },
  handleModifyEnd(event, type) {
    const features = event.features.getArray()
    features.forEach((feature) => {
      const coordinates = feature.getGeometry().getCoordinates().map(
        polygon => polygon.map(
          ring => ring.map(
            point => transform(point, 'EPSG:3857', 'EPSG:4326')
          )
        )
      )
      const featureId = feature.id
      // api.updateCoordinates(featureId, coordinates, type)
    })
  }
}