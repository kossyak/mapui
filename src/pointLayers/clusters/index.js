import { Cluster } from 'ol/source.js'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { clusterStyle } from '../style'
import GeoJSON from 'ol/format/GeoJSON'

import { Icon, Style, Fill, Text } from 'ol/style'

import chart from './chart'

function createStyle(src, img) {
  return new Style({
    image: new Icon({
      anchor: [0.5, 0.96],
      crossOrigin: 'anonymous',
      src: src,
      img: img,
      imgSize: img ? [img.width, img.height] : undefined,
    }),
    text: new Text({
      text: '23',
      fill: new Fill({
        color: '#fff'
      })
    })
  })
}

export default {
  create(wells, points) {
    const features = new GeoJSON().readFeatures({
        type: 'FeatureCollection',
        crs: {type: 'name', properties: {name: 'EPSG:4326'}},
        features:points
      }, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    
    const source = new VectorSource({ features })
    const clusterSource = new Cluster({
      // distance: parseInt(distanceInput.value, 10), 40
      // minDistance: parseInt(minDistanceInput.value, 10),
      source,
    })
    const styleCache = {}
    return new VectorLayer({
      source: clusterSource,
      // style: icon
      // style: (feature) => {
      //   const size = feature.get('features').length
      //     let style = styleCache[size]
      //     if (!style) {
      //       style = clusterStyle(size)
      //       styleCache[size] = style
      //     }
      //     return style
      //   }
      style: (feature) => {
        const un = []
        feature.get('features').forEach( f => {
          f.values_.aquifer_usage?.forEach(aq => {
            const index = un.findIndex(t => t.id === aq.id)
            if (index === -1) {
              un.push({id: aq.id, count: 1, color: aq.color})
            } else {
              un[index].count += 1
            }
          })
        })
        return new Style({
          image: new Icon({
            crossOrigin: 'anonymous',
            img: chart.create({
              data: un.map(el => el.count),
              colors: un.map(el => el.color),
              holeSize: 0.7,
              radius: 15,
              stroke: 0.5
            })
          }),
          text: new Text({
            text: (feature.get('features')).length.toString(),
            fill: new Fill({
              color: '#000'
            })
          })
        })
      }
    })
  }
}