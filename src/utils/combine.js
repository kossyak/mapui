import { transform } from 'ol/proj'

export default function combine(original) {
  let n = []
  for (let i = 0; i < original.length; i += 2) {
    const c = transform([original[i], original[i+1]], 'EPSG:3857', 'EPSG:4326')
    n.push([c[1], c[0]])
  }
  return n
}