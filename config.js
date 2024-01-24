const host = 'https://darcydb.ru' // 'http://127.0.0.1:8080'

export default {
  host,
  projection: 'EPSG:4326', // Проекция отображения координат (WGS-84)
  services: {
    export: () => 'http://localhost:1234/' + '/static/services/export/index.html',
    choosen_chem: (selected) => host + `/base/api/chem/${selected.map(e => e.id)}/choosen_table/`,
    reg: (selected) => host + '/base/api/regime/' + selected.id + '/plot/',
    gis: (selected) => host + '/base/api/gph/' + selected.id + '/list/',
    efw: (selected) => host + '/base/api/efw/' + selected.id + '/list/',
    chem: (selected) => host + '/base/api/chem/' + selected.id + '/list/',
    mon: (selected) => 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=0&lon=0&zoom=2',
  }
}