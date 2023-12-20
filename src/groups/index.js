import GroupLayer from 'ol/layer/Group'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import OSM from 'ol/source/OSM'
import secret from '../../secret.js'
import { pointStyle } from '../pointLayers/style'

export default {
  create(layers) {
    const {
      exploLabel,
      razvLabel,
      regLabel,
      razvexpLabel,
      minLabel,
      explo,
      razv,
      reg,
      razvexp,
      min,
      fields,
      VZU
    } = layers
    return {
      OSM: new TileLayer({ source: new OSM() }),
      arcgis_sp: new TileLayer({
        visible: false,
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          maxZoom: 19, // Уровень максимального масштаба
        })
      }),
      google_sp: new TileLayer({
        visible: false,
        source: new XYZ({
          url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          maxZoom: 20,
        })
      }),
      terrain: new TileLayer({
        visible: false,
        source: new XYZ({
          url: `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/{z}/{x}/{y}.pngraw?access_token=${ secret?.mapboxAccessToken || '' }`,
          attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a>',
        }),
        style: pointStyle([66, 100, 251, 0.3], [66, 100, 251, 1])
      }),
      fields: new GroupLayer({
        visible: true,
        layers: [fields]
      }),
      VZU: new GroupLayer({
        visible: true,
        layers: [VZU]
      }),
      explo: new GroupLayer({
        visible: true,
        layers: [explo, exploLabel]
      }),
      razv: new GroupLayer({
        visible: true,
        layers: [razv, razvLabel]
      }),
      razvexp: new GroupLayer({
        visible: true,
        layers: [razvexp, razvexpLabel]
      }),
      reg: new GroupLayer({
        visible: true,
        layers: [reg, regLabel]
      }),
      min: new GroupLayer({
        visible: true,
        layers: [min, minLabel]
      })
    }
  }
}