const host = 'http://127.0.0.1:8080' // 'http://127.0.0.1:8080'

export default {
  host,
  projection: 'EPSG:4326', // Проекция отображения координат (WGS-84)
  services: {
    export: () => host + '/static/servises/export/index.html',
    choosen_chem: (selected) => host + `/base/api/chem/${selected.map(e => e.nameGwk)}/choosen_table/`,
    reg: (selected) => host + '/base/api/regime/' + selected.pk + '/plot/',
    gis: (selected) => host + '/base/api/gph/' + selected.pk + '/list/',
    efw: (selected) => host + '/base/api/efw/' + selected.pk + '/list/',
    chem: (selected) => host + '/base/api/chem/' + selected.pk + '/list/'
  }
}