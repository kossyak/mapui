import { Fill, Stroke, Text, Style, Circle as CircleStyle } from 'ol/style'

function clusterStyle(size) {
  return new Style({
    image: new CircleStyle({
      radius: 10,
      stroke: new Stroke({
        color: '#fff'
      }),
      fill: new Fill({
        color: '#3399CC'
      })
    }),
    text: new Text({
      text: size.toString(),
      fill: new Fill({
        color: '#fff'
      })
    })
  })
}

function pointStyle(feature, fill = '#ffffff', stroke = '#000000') {
  return new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: fill
      }),
      stroke: new Stroke({
        color: stroke + 'dd',
        width: 2
      })
    }),
    visible: false
  })
}
function labelStyle() {
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
}
export { clusterStyle, pointStyle, labelStyle }