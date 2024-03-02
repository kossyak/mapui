import { Cluster } from 'ol/source.js'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { clusterStyle } from '../style'
import GeoJSON from 'ol/format/GeoJSON'

import { Icon, Style, Fill, Text } from 'ol/style'

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
  });
}


const icon = (feature) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 20;
    canvas.height = 20;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 10;
  
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'green';
  context.fill();
  context.lineWidth = 0;
  context.strokeStyle = '#003300';
  context.stroke();
  return createStyle(undefined, canvas)
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
      style: (feature) => {
        const size = feature.get('features').length
          let style = styleCache[size]
          if (!style) {
            style = clusterStyle(size)
            styleCache[size] = style
          }
          return style
        }
    })
  }
}