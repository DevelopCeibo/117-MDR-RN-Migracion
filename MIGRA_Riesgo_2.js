const fs = require('fs')
const { stringify } = require('csv-stringify')
const axios = require('axios')

async function getRiesgos() {
  const filename = './assets/riesgo/MIGRA_Riesgo_v01.csv'
  const writableStream = fs.createWriteStream(filename)
  axios.defaults.headers.common['Authorization'] =
    'Basic dXN1YXJpby53czpRYmUxMzU3OQ=='
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  const columns = [
    'Contacto',
    'Detalle_de_Cobertura',
    'Detalle_de_Riesgo',
    'Estado',
    'Fecha_de_creacion',
    'Fecha_de_ultima_actualizacion',
    'ID',
    'Id_Tipo_Riesgo',
    'Numero_Poliza',
    'Patente',
    'Poliza',
    'Tomador_Riesgo'
  ]

  const stringifier = stringify({
    header: true,
    columns: columns,
    delimiter: '|'
  })

  let totalRegistros = 0
  await axios
    .post(
      'https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults',
      {
        id: 101736
      }
    )
    .then(function (response) {
      response.data.rows.forEach((row) => {
        const newRow = row.map((data) => data?.replace(/\r\n|\n|\r/g, ' '))
        stringifier.write(newRow)
      })
      if (response.data.count < 10000) {
        totalRegistros = response.data.count
        console.log(response.data.count, '<<--count--')
      } else {
        console.log(response.data.count, '<<--count--')
        console.log('end ->', end, 'start ->', start, 'loop ->', loop)
        throw new Error('Posible pérdida de datos al realizar el pedido post')
      }
    })
    .catch(function (error) {
      console.log(error)

      return error
    })

  stringifier.pipe(writableStream)
  console.log(`Los datos fueron guardados en archivo: ${filename} `)
  console.log(`Se han guardado un total de ${totalRegistros} registros.`)
  return null
}

getRiesgos()
