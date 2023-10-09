const fs = require('fs')
const { stringify } = require('csv-stringify')

const axios = require('axios')

//postRN(6106466, 6106266, 1)

async function postRN(end, start, loop = 1) {
  const filename =
    loop < 10
      ? `./assets/respuestas/MIGRA_Respuesta_v0${loop}.csv`
      : `./assets/respuestas/MIGRA_Respuesta_v${loop}.csv`
  const writableStream = fs.createWriteStream(filename)
  axios.defaults.headers.common['Authorization'] =
    'Basic dXN1YXJpby53czpRYmUxMzU3OQ=='
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  const columns = [
    'Nro Incidente',
    'Clave ajena',
    'Cuenta',
    'Fecha de creación',
    'ID de contacto',
    'ID de cuenta de canal',
    'ID de hilo del incidente',
    'Secuencia',
    'Texto',
    'Tipo de entrada de hilo',
    'Peso'
  ]

  const stringifier = stringify({
    header: true,
    columns: columns,
    delimiter: ','
  })

  let data = []
  await axios
    .post(
      'https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults',
      {
        id: 101740,
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
      //console.log(response.data.count, '<<--count--')

      const r = response.data.rows.map((row) => {
        stringifier.write(row)
        //console.log(row)
      })
      if (response.data.count < 10000) {
        console.log(response.data.count, '<<--count--')
      } else {
        throw new Error('Posible pérdida de datos al realizar el pedido post')
      }
    })
    .catch(function (error) {
      console.log(error)

      return error
    })

  stringifier.pipe(writableStream)
  console.log(`Los datos fueron guardados en archivo: ${filename} `)

  return data
}

async function getRespuestas() {
  const ultimoRegistro = 6106466 // 250
  const primerRegistro = 0 // 100
  const cantidadPorArchivo = 9000

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
    await postRN(indexHasta, indexDesde, loop)
    loop++
  }

  console.log(`Se han guardado ${loop - 1} archivos`)
}

getRespuestas()
