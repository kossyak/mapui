import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import WKT from 'ol/format/WKT'
import Modify from 'ol/interaction/Modify'
import { transform } from "ol/proj"
import { Fill, Stroke, Style } from 'ol/style'
import api from '../../api'

export default {
  create({ type, data, style }) {
    this.style = style
    this.layer = new VectorLayer({ source: new VectorSource() })
    this.addPolygons(data)
    return { layer: this.layer, interaction: this.addModify(type) }
  },
  addModify(type) {
    const interaction = new Modify({
      source: this.layer.getSource(),
      modifyend: (event) => this.handleModifyEnd(event, type)
    })
    interaction.setActive(false)
    return interaction
  },
  addPolygons(items) {
    items.forEach(item => this.addPolygon(item))
  },
  addPolygon(item) {
    const format = new WKT()
    if (item.geom && item.geom.length > 10) {
      const croppedGeom = item.geom.substring(10);
      const feature = format.readFeature(croppedGeom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
      feature.setProperties({
        intake_name: item.intake_name,
        field_name: item.field_name?.replace("\"", ''),
        pk: item.id
        // ...
      })
      this.style && feature.setStyle(this.polygonStyle())
      this.layer.getSource().addFeature(feature)
    }
  },
  polygonStyle() {
    return new Style({
    fill: new Fill({
      color: this.style.fillColor
    }),
    stroke: new Stroke({
      color: this.style.strokeColor,
      width: 1
    })
  })
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
      const featureId = feature.get('pk')
      api.updateCoordinates(featureId, coordinates, type)
    })
  }
}