import { Fill, Stroke, Style, Circle as CircleStyle } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'

export default {
  create(bus) {
    this.bus = bus
    this.layer = null
  },
  move(coordinates) {
    this.bus.map.removeLayer(this.layer)
    this.layer =  new VectorLayer({
      source: new VectorSource({
        features: [new Feature({
          geometry: new Point(coordinates)
        })]
      }),
      style: this.pointStyle()
    })
    this.bus.map.addLayer(this.layer)
  },
  remove() {
    this.bus.map.removeLayer(this.layer)
  },
  pointStyle() {
    return new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: 'red'
        }),
        stroke: new Stroke({
          color: 'white',
          width: 2
        })
      }),
      visible: false
    })
  }
}