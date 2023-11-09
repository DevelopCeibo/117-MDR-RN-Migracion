const fs = require('fs')
const { stringify } = require('csv-stringify')
const axios = require('axios')
const { dirname } = require('path')

async function postRN(end, start, loop = 1) {
  const filename =
    loop < 10
      ? `./assets/contacto/MIGRA_Contacto_v0${loop}.csv`
      : `./assets/contacto/MIGRA_Contacto_v${loop}.csv`

  let baseDir = dirname(filename)

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }

  const writableStream = fs.createWriteStream(filename)

  axios.defaults.headers.common['Authorization'] =
    'Basic dXN1YXJpby53czpRYmUxMzU3OQ=='
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  const columns = [
    'Acepta_Envio_Informacion',
    'Apellido',
    'Calle',
    'Codigo_Postal',
    'Conexion',
    'Conflictivo',
    'Correo_electronico_no_valido',
    'Correo_E_alternativo_1',
    'Correo_E_alternativo_2',
    'Departamento',
    'Direccion_de_correo_electronico',
    'DNI',
    'Fecha_Alta',
    'Fecha_de_creacion',
    'Fecha_de_ultima_actualizacion',
    'Fecha_Rechazo_Op',
    'ID_de_contacto',
    'ID_de_usuario',
    'ID_en_AIS',
    'Id_en_BI',
    'Localidad',
    'Marca_ADS',
    'No_Molestar',
    'Nombre',
    'Nombre_completo',
    'Numero_de_domicilio',
    'Pais',
    'Piso',
    'Poliza_Vida',
    'Poliza_Vida_2',
    'Poliza_Vida_3',
    'Poliza_Vida_4',
    'Provincia',
    'Telefono_de_la_oficina_sin_formato',
    'Telefono_de_oficina',
    'Telefono_del_asistente',
    'Telefono_del_asistente_sin_formato',
    'Telefono_movil',
    'Telefono_movil_sin_formato',
    'Telefono_particular',
    'Telefono_particular_sin_formato',
    'Tipo_Documento',
    'Vendedor'
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
        id: 101730,
        filters: [
          {
            name: 'id1',
            values: JSON.stringify(end) //12308002
          },
          {
            name: 'id2',
            values: JSON.stringify(start) //131930
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

async function getContactos() {
  const ultimoRegistro = 12308928 // 12308180
  const primerRegistro = 12308180 // 131930
  const cantidadPorArchivo = 9000
  let totalRegistros = 0

  let loop = 1354

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

getContactos()
