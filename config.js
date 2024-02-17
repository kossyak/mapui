const host = 'https://darcydb.ru' // 'http://127.0.0.1:8080'

export default {
  host,
  projection: 'EPSG:4326', // Проекция отображения координат (WGS-84)
  services: {
    export: () => 'http://localhost:1234/' + '/static/services/export/index.html',
    choosen_chem: (selected) => host + `/base/api/chem/${selected.map(e => e.id)}/choosen_table/`,
    reg: ({ id }) => host + '/base/api/regime/' + id + '/plot/',
    gis: ({ id }) => host + '/base/api/gph/' + id + '/list/',
    efw: ({ id }) => host + '/base/api/efw/' + id + '/list/',
    chem: ({ id }) => host + '/base/api/chem/' + id + '/list/',
    ws: ({ id }) => host + '/base/api/ws/' + id + '/plot/',
    mon: (selected) => 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=0&lon=0&zoom=2',
    protocol: ({ id }) => host + '/base/api/fields/' + id + '/protocol/',
    balances: ({ id }) => host + '/base/api/fields/' + id + '/balances/',
    plan: ({ id }) => host + '/base/api/fields/' + id + '/plan/',
    report: ({ id }) => host + '/base/api/fields/' + id + '/report/',
    documents: ({ id }) => host + '/base/api/fields/' + id + '/documents/',
    license: ({ id }) => host + '/base/api/intakes/' + id + '/license/',
    wells: ({ id }) => host + '/base/api/intakes/' + id + '/wells/',
    deadlines: ({ id }) => host + '/base/api/intakes/' + id + '/deadlines/',
    withdrawal: ({ id }) => host + '/base/api/intakes/' + id + '/withdrawal/'
  }
}