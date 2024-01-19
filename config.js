const host = '' // 'http://127.0.0.1:8080'

export default {
  host,
  projection: 'EPSG:4326', // Проекция отображения координат (WGS-84)
  services: {
    export: () => 'http://localhost:1234/services/export/index.html',
    reg: (selected) => host + '/base/api/regime/' + selected.pk + '/plot/',
    gis: (selected) => host + '/base/api/gph/' + selected.pk + '/list/',
    ofp: (selected) => host + '/base/api/efw/' + selected.pk + '/list/',
    him: (selected) => host + '/base/api/chem/' + selected.pk + '/list/'
  }
}