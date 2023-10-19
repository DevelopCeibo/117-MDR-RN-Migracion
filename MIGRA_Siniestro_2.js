const fs = require('fs')
const { stringify } = require('csv-stringify')

const axios = require('axios')

async function postRN(end, start, loop = 1) {
  const filename =
    loop < 10
      ? `./assets/siniestro/MIGRA_Siniestro_v0${loop}.csv`
      : `./assets/siniestro/MIGRA_Siniestro_v${loop}.csv`
  const writableStream = fs.createWriteStream(filename)

  axios.defaults.headers.common['Authorization'] =
    'Basic dXN1YXJpby53czpRYmUxMzU3OQ=='
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  const columns = [
    'Apellido_Conductor',
    'Apellido_y_Nombre',
    'Calle',
    'Causa',
    'Codigo_de_Productor',
    'Codigo_Postal',
    'Codigo_Producto',
    'Comiseria',
    'Contacto',
    'Danios_Propios',
    'Danios_Terceros',
    'Documento_Conductor',
    'Estado',
    'Fecha_de_creacion',
    'Fecha_de_siniestro',
    'Fecha_de_ultima_actualizacion',
    'Fecha_siniestro',
    'Hora',
    'ID',
    'Lesiones_Terceros',
    'Localidad',
    'Nombre_Conductor',
    'Numero',
    'Numero_de_Documento',
    'Numero_de_Siniestro',
    'Numero_de_Siniestro_Nuevo',
    'Oficina',
    'Pais',
    'Poliza',
    'Producto',
    'Productor',
    'Provincia',
    'Responsable',
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
        id: 101737,
        filters: [
          {
            name: 'id1',
            values: JSON.stringify(end) //474547
          },
          {
            name: 'id2',
            values: JSON.stringify(start) //473547
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

async function getSiniestros() {
  const ultimoRegistro = 474685 // 250
  const primerRegistro = 0 // 100
  const cantidadPorArchivo = 9000
  let totalRegistros = 0

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
    const cantidadRegistros = await postRN(indexHasta, indexDesde, loop)
    loop++
    totalRegistros += cantidadRegistros
  }

  console.log(`Se han guardado ${loop - 1} archivos.`)
  console.log(`Se han guardado un total de ${totalRegistros} registros.`)
}

getSiniestros()
