import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Modify from 'ol/interaction/Modify'
import { transform } from "ol/proj"
import { Fill, Stroke, Style } from 'ol/style'
import api from '../../../api'
import GeoJSON from 'ol/format/GeoJSON'

export default {
  create({ type, features = [], style }) {
    const source = new VectorSource({
      features: new GeoJSON().readFeatures({
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:4326'
          }
        }, features }, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        })
    })
    const layer = new VectorLayer({
      source: source,
      style: this.polygonStyle(style)
    })
    const interaction = this.addModify(layer, type)
    return { layer, interaction }
  },
  addModify(layer, type) {
    const interaction = new Modify({
      source: layer.getSource(),
      modifyend: (event) => this.handleModifyEnd(event, type)
    })
    interaction.setActive(false)
    return interaction
  },
  polygonStyle(style) {
    if (style) {
      return new Style({
        fill: new Fill({
          color: style.fillColor
        }),
        stroke: new Stroke({
          color: style.strokeColor,
          width: 1
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
      api.updateCoordinates(featureId, coordinates, type)
    })
  }
}