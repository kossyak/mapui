import GroupLayer from 'ol/layer/Group'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import OSM from 'ol/source/OSM'
import secret from '../../secret.js'
import { pointStyle } from '../pointLayers/style'
import TileWMS from 'ol/source/TileWMS.js'

export default {
  create(layers) {
    const {
      p26Label,
      p31Label,
      p43Label,
      p654Label,
      p26,
      p31,
      p43,
      p654,
      fields,
      intakes,
      license,
      section
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
      OSM: new TileLayer({ source: new OSM() }),
        geoserver_sp: new TileLayer({
          visible: !1,
          source: new TileWMS({
            url: 'https://geoserver.darcydb.ru/geoserver/N37-25000/wms',
            // maxZoom: 19,
            params: {
              'LAYERS': 'N37-25000:N-37_25000',
              'authkey': `${secret?.geoserverAuthToken || ''}`
            },
            serverType: 'geoserver',
            transition: 0,
            preload: 0,
          }),
        }),
        GeoserverMap_25000_VEC_2: new TileLayer({
          source: new TileWMS({
            url: 'https://geoserver.darcydb.ru/geoserver/relief/wms',
            params: {
              'LAYERS': '  relief:ГГК_200_1_M_36_VI_Карта_четвертичных_отложений_modified',
              'authkey': `${secret?.geoserverAuthToken || ''}`
            },
            serverType: 'geoserver',
          }),
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
      intakes: new GroupLayer({
        visible: true,
        layers: [intakes]
      }),
      license: new GroupLayer({
        visible: true,
        layers: [license]
      }),
      section: new GroupLayer({
        visible: true,
        layers: [section]
      }),
      p26: new GroupLayer({
        visible: false,
        layers: [p26, p26Label]
      }),
      p31: new GroupLayer({
        visible: false,
        layers: [p31, p31Label]
      }),
      p43: new GroupLayer({
        visible: false,
        layers: [p43, p43Label]
      }),
      p654: new GroupLayer({
        visible: false,
        layers: [p654, p654Label]
      })
    }
  }
}