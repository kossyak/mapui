import { Fill, Stroke, Text, Style, Circle as CircleStyle } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import secret from '../../secret.js'

export default {
  pointStyle(fill = [255, 0, 0, 0.7], stroke = 'black') {
    return new Style({
      stroke: new Stroke({
        color: stroke,
        width: 4
      }),
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: fill
        })
      })
    })
  },
  labelStyle() {
    return (feature) => {
      return new Style({
        text: new Text({
          text: feature.get('name'),
          offsetY: -10,
          fill: new Fill({
            color: 'black'
          })
        })
      })
    }
  },
  create(pointSource, wells) {
    const layers = {}
    wells.forEach(item => {
      const key = item.key
      layers[key] = new VectorLayer({ source: pointSource[key], style: this.pointStyle(item.color) })
      layers[key + 'Label'] = new VectorLayer({ source: pointSource[key], style: this.labelStyle(), visible: false })
    })
    return {
      ...layers,
      terrain: new TileLayer({
        source: new XYZ({
          url: `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/{z}/{x}/{y}.pngraw?access_token=${ secret?.mapboxAccessToken || '' }`,
          attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a>',
        }),
        style: this.pointStyle([66, 100, 251, 0.3], [66, 100, 251, 1])
      })
    }
  }
}

