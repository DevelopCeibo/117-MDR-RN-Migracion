const fs = require('fs')
const axios = require('axios')
const { stringify } = require('csv-stringify')
const dotenv = require('dotenv')

dotenv.config()

async function postRN(end, start, loop = 1) {
  const filename =
    loop < 10
      ? `./assets/incidente/MIGRA_Incidente_v0${loop}.csv`
      : `./assets/incidente/MIGRA_Incidente_v${loop}.csv`
  const writableStream = fs.createWriteStream(filename)

  axios.defaults.headers.common['Authorization'] = process.env.ORACLE_PASSWORD
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  const columns = [
    'Nro_de_referencia',
    'Actualizado_por',
    'Asunto',
    'Buzon_de_correo',
    'Cola',
    'Creado_por_cuenta',
    'Modo_de_Contacto',
    'Usuario_Intra',
    'Tipo_de_Incidente',
    'Tipo_de_estado',
    'Tipo_Cobro',
    'Siniestro',
    'Poliza',
    'Nro_Cuenta',
    'ID_de_producto',
    'ID_de_incidente',
    'ID_de_disposicion',
    'ID_de_contacto',
    'ID_de_categoria',
    'Grupo',
    'Fecha_Efecto',
    'Fecha_de_ultima_respuesta',
    'Fecha_de_ultima_actualizacion',
    'Fecha_de_creacion',
    'Fecha_de_cierre',
    'Estado',
    'Cuenta_asignada',
    'ID_de_organizacion'
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
        id: 101727,
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

async function getIncidentes() {
  const ultimoRegistro = 4354386 // 4354386
  const primerRegistro = 0 // 0
  const cantidadPorArchivo = 9000
  let totalRegistros = 0

  let loop = 1

  const directorio = `./assets/incidente`

  // Asegurarse de que el directorio exista, si no, créalo
  if (!fs.existsSync(directorio)) {
    fs.mkdirSync(directorio, { recursive: true })
  }

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

getIncidentes()
