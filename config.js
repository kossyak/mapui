const host = 'https://darcydb.ru' // 'http://127.0.0.1:8080' //

const test = `https://storage.yandexcloud.net/s3-for-groundwater-db/doc_1139/anal_3_1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YCAJExq0CJ58qDw1lmNtJrHdq%2F20240421%2Fru-central1%2Fs3%2Faws4_request&X-Amz-Date=20240421T120642Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=eabe02403a9a43e3b6bfddcd302878bf998788bbb4808e0919f9d79089d75abc`

export default {
  host,
  projection: 'EPSG:4326', // Проекция отображения координат (WGS-84)
  user: {},
  wellTypes: [], // in edit form
  onmessage: () => {}, // in main.js,
  searchResults: () => {}, // in global search and edit form
  getFeatureById: () => {}, // in global search and edit form
  services: {
    export: () => host + '/static/services/export/index.html', // http://localhost:1234/export/index.html',
    choosen_chem: (selected) => host + `/base/api/chem/${selected.map(e => e.id)}/choosen_table/`,
    reg: ({ id }) => host + '/base/api/regime/' + id + '/plot/',
    gis: ({ id }) => host + '/base/api/gph/' + id + '/list/',
    efw: ({ id }) => host + '/base/api/efw/' + id + '/list/',
    docs: ({ id }) => host + '/base/api/wells/' + id + '/documents/',
    chem: ({ id }) => host + '/base/api/chem/' + id + '/list/',
    ws: ({ id }) => host + '/base/api/ws/' + id + '/plot/',
    mon: (selected) => 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=0&lon=0&zoom=2',
    protocol: ({ id }) => test, // host + '/base/api/fields/' + id + '/protocol/',
    balances: ({ id }) => host + '/base/api/fields/' + id + '/balances/',
    plan: ({ id }) => host + '/base/api/fields/' + id + '/plan/',
    report: ({ id }) => host + '/base/api/fields/' + id + '/report/',
    documents: ({ id }) => host + '/base/api/fields/' + id + '/documents/',
    license: ({ id }) => host + '/base/api/intakes/' + id + '/license/',
    wells: ({ id }) => host + '/base/api/intakes/' + id + '/wells/',
    deadlines: ({ id }) => host + '/base/api/intakes/' + id + '/deadlines/',
    withdrawal: ({ id }) => host + '/base/api/intakes/' + id + '/withdrawal/',
    source_file: (selected) => 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=0&lon=0&zoom=2',
    pois: (selected) => 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=0&lon=0&zoom=2',
    map_ref: (selected) => 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=0&lon=0&zoom=2',
  },
  api: {
    wellsJson: {
      get: host + '/base/api/wells/?format=json&limit=5000', // 'https://darcydb.ru/base/api/wells/?format=json&limit=300', // '/wells.json', // host + '/base/api/wells/?format=json&limit=300', //'https://darcydb.ru/base/api/wells/?format=json&limit=5000', // host + '/base/api/wells/?format=json&limit=5000',
      set: host + '/base/api/wells/update/'
    },
    fieldsJson: {
      get: host + '/base/api/fields/?format=json&limit=5000', // host + '/base/api/fields/?format=json',
      set: host + '/base/api/fields/',
    },
    intakesJson: {
      get: host + '/base/api/intakes/?format=json&limit=5000', // host + '/base/api/intakes/?format=json',
      set: host + '/base/api/intakes/'
    },
    licenseJson: {
      get: host + '/base/api/license?format=json&limit=5000',
      set: host + '/base/api/license/'
    },
    sectionJson: {
      get: host + '/base/api/sections?format=json&limit=5000',
      set: host + '/base/api/sections/'
    },
    search: host + '/fts/api/fts/?search=',
    wellTypesUrl: host + '/base/api/dictentities/?entity=2',
    fieldSelect: host + '/base/api/fields/?format=json&limit=5&search=',
    intakeSelect: host + '/base/api/intakes/?format=json&limit=5&search=',
    aquiferSelect: host + '/base/api/aquifercodes/?format=json&limit=5&search=',
    user: host + '/api/users/me/',
    login: host + '/accounts/login/',
    logout: host + '/accounts/logout/',
    updateWells: host + '/base/api/wells/update/'
  }
}