import { Fill, Stroke, Text, Style, Circle as CircleStyle } from 'ol/style'

function pointStyle(feature, resolution, fill = [255, 0, 0, 0.7], stroke = 'black') {
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
export { pointStyle, labelStyle }