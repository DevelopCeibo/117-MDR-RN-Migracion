const fs = require('fs')
const axios = require('axios')
const { stringify } = require('csv-stringify')
const dotenv = require('dotenv')

dotenv.config()

async function postRN(end, start, loop = 1) {
  const filename =
    loop < 10
      ? `./assets/poliza/MIGRA_Poliza_v0${loop}.csv`
      : `./assets/poliza/MIGRA_Poliza_v${loop}.csv`

  const writableStream = fs.createWriteStream(filename)

  axios.defaults.headers.common['Authorization'] = process.env.ORACLE_PASSWORD
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  const columns = [
    'ID',
    'Acreedor_Prendario_Hipotecario',
    'Actualizado_por',
    'Bolso_Compra',
    'Canal_de_cobro',
    'Codigo_Productor',
    'Compania',
    'Condicion_de_IVA',
    'Contacto',
    'Creado_por',
    'E_Cupones',
    'E_Poliza',
    'Estado',
    'Fecha_de_creacion',
    'Fecha_de_Emision',
    'Fecha_de_ultima_actualizacion',
    'Fecha_Siniestro',
    'Grupo_de_afinidad',
    'Grupo_Organizador',
    'Numero_de_cuenta',
    'Numero_de_Cuenta_Enmascarado',
    'Organizador',
    'Poliza',
    'Producto',
    'Productor',
    'SubRamo',
    'Sucursal',
    'Tipo_de_cuenta',
    'Tomador_Riesgo',
    'Vendedor',
    'Vigencia_Desde',
    'Vigencia_Hasta'
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
        id: 101734,
        filters: [
          {
            name: 'id1',
            values: JSON.stringify(end) //1337840
          },
          {
            name: 'id2',
            values: JSON.stringify(start) //1337840
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

async function getPolizas() {
  const ultimoRegistro = 1340557 // 1340557
  const primerRegistro = 0 // 0
  const cantidadPorArchivo = 9000
  let totalRegistros = 0

  let archivoIndex = 0
  let loop = 1

  const directorio = `./assets/poliza`

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

getPolizas()
