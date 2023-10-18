const fs = require('fs')
const { stringify } = require('csv-stringify')
const axios = require('axios')

async function postRN(end, start, loop = 1) {
  const filename =
    loop < 10
      ? `./assets/notaPrivadas/MIGRA_NotaPrivada_v0${loop}.csv`
      : `./assets/notaPrivadas/MIGRA_NotaPrivada_v${loop}.csv`
  const writableStream = fs.createWriteStream(filename)

  axios.defaults.headers.common['Authorization'] =
    'Basic dXN1YXJpby53czpRYmUxMzU3OQ=='
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  const columns = [
    'Nro_de_referencia',
    'ID_de_incidente',
    'ID_de_hilo_del_incidente',
    'Fecha_de_creacion',
    'Fecha_de_cierre',
    'Modo_de_Contacto',
    'Jerarquia_de_categoria',
    'ID_de_categoria',
    'Estado',
    'Texto'
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
        id: 101741,
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

async function getNotasPrivadas() {
  const ultimoRegistro = 1030466 // 6106466
  const primerRegistro = 1021466 // 0
  const cantidadPorArchivo = 9000
  let totalRegistros = 0

  let loop = 565

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
    const cantidadRegistros = await postRN(indexHasta, indexDesde, loop)
    loop++
    totalRegistros += cantidadRegistros
  }

  console.log(`Se han guardado ${loop - 1} archivos.`)
  console.log(`Se han guardado un total de ${totalRegistros} registros.`)
}

getNotasPrivadas()
