const fs = require('fs')
const { stringify } = require('csv-stringify')
const axios = require('axios')

//postRN()

async function postRN(end, start, loop = 1) {
  const filename =
    loop < 10
      ? `./assets/logActividad/MIGRA_LogActividad_v0${loop}.csv`
      : `./assets/logActividad/MIGRA_LogActividad_v${loop}.csv`
  const writableStream = fs.createWriteStream(filename)

  axios.defaults.headers.common['Authorization'] =
    'Basic dXN1YXJpby53czpRYmUxMzU3OQ=='
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  const columns = [
    'ID_de_contacto',
    'ID_de_incidente',
    'Fecha',
    'Sector',
    'Asesor',
    'Accion_realizada',
    'Descripcion',
    'ID_de_tipo_de_transaccion',
    'Inicial',
    'Direccion_IP_del_cliente'
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
        id: 101742,
        filters: [
          {
            name: 'id1',
            values: JSON.stringify(end) //6106466
          },
          {
            name: 'id2',
            values: JSON.stringify(start) //6096469
          }
        ]
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

  return totalRegistros
}

async function getLogActividad() {
  const ultimoRegistro = 4354386 // 4316800
  const primerRegistro = 4316800 // 399
  const cantidadPorArchivo = 500
  let totalRegistros = 0

  let archivoIndex = 4317
  let loop = 1

  for (
    let index = ultimoRegistro;
    index > primerRegistro;
    index -= cantidadPorArchivo
  ) {
    const indexHasta = index
    const indexDesde =
      index - cantidadPorArchivo > primerRegistro
        ? index - cantidadPorArchivo
        : primerRegistro
    const cantidadRegistros = await postRN(
      indexHasta,
      indexDesde,
      archivoIndex + loop
    )
    loop++
    totalRegistros += cantidadRegistros
  }

  console.log(`Se han guardado ${loop - 1} archivos.`)
  console.log(`Se han guardado un total de ${totalRegistros} registros.`)
}

getLogActividad()
