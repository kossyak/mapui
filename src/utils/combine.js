import { transform } from 'ol/proj'

export default function combine(original) {
  let n = []
  for (let i = 0; i < original.length; i += 2) {
    n.push(transform([original[i + 1], original[i]], 'EPSG:3857', 'EPSG:4326'))
  }
  return n
}