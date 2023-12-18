import GroupLayer from 'ol/layer/Group'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import OSM from 'ol/source/OSM'

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
      terrain,
      fields,
      VZU
    } = layers
    return {
      OSM: new TileLayer({ source: new OSM() }),
      arcgis_sp: new TileLayer({
        title: 'ArcGIS',
        visible: false,
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          maxZoom: 19, // Уровень максимального масштаба
        })
      }),
      google_sp: new TileLayer({
        title: 'Google',
        visible: false,
        source: new XYZ({
          url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          maxZoom: 20,
        })
      }),
      terrain: new GroupLayer({
        title: 'MapBox',
        visible: false,
        layers: [terrain]
      }),
      fields: new GroupLayer({
        title: 'Меторождения',
        visible: true,
        layers: [fields]
      }),
      VZU: new GroupLayer({
        title: 'Водозаборы',
        visible: true,
        layers: [VZU]
      }),
      explo: new GroupLayer({
        title: 'Эксплуатационные',
        visible: true,
        layers: [explo, exploLabel]
      }),
      razv: new GroupLayer({
        title: 'Разведочные',
        visible: true,
        layers: [razv, razvLabel]
      }),
      razvexp: new GroupLayer({
        title: 'Разведочно-эксплуатационные',
        visible: true,
        layers: [razvexp, razvexpLabel]
      }),
      reg: new GroupLayer({
        title: 'Режимные',
        visible: true,
        layers: [reg, regLabel]
      }),
      min: new GroupLayer({
        title: 'Минеральные',
        visible: true,
        layers: [min, minLabel]
      })
    }
  }
}