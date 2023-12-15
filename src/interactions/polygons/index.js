import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import WKT from 'ol/format/WKT'
import Modify from 'ol/interaction/Modify'
import { transform } from "ol/proj"
import { Fill, Stroke, Style } from 'ol/style'

export default {
  create({ getUrl, setUrl, data, style }) {
    this.style = style
    this.layer = new VectorLayer({ source: new VectorSource() })
    // this.load(getUrl)
    this.addPolygons(data)
    return { layer: this.layer, interaction: this.addModify(setUrl) }
  },
  load() {
    // fetch(getUrl)
    // .then(response => response.json())
    // .then(data => this.addPolygons(data)).catch(error => console.error('Error fetching data:', error))
  },
  addModify(setUrl) {
    const interaction = new Modify({
      source: this.layer.getSource(),
      modifyend: (event) => this.handleModifyEnd(event, setUrl)
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
        field_name: item.field_name,
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
  handleModifyEnd(event, coordinates_url) {
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
      this.updateCoordinates(featureId, coordinates, coordinates_url)
    })
  },
  updateCoordinates(featureId, coordinates, coordinates_url) {
    const url = `${coordinates_url}${featureId}`
    const data = { coordinates }
    console.log(url)
    console.log('Отправляемый запрос:', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
}