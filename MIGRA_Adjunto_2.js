const {
  readdirSync,
  readFileSync,
  Dirent,
  mkdirSync,
  existsSync,
  writeFileSync
} = require('fs')
const { join, basename } = require('path')
const { parse } = require('csv-parse/sync')
const axios = require('axios')

const incidenteId = 4314463 // Reemplaza con el valor adecuado
const adjuntoId = 1034317 // Reemplaza con el valor adecuado
const fileName = 'RE_ LISTADO DE POLIZAS ZURICH __ PASE DE CODIGO.zip' // Reemplaza con el valor adecuado

const getAFile = async (incidenteId, adjuntoId) => {
  const config = {
    responseType: 'arraybuffer',
    headers: {
      Authorization: 'Basic dXN1YXJpby53czpRYmUxMzU3OQ==',
      'Content-Type': 'application/document'
    }
  }

  const file = await axios
    .get(
      `https://qbe.custhelp.com/services/rest/connect/v1.3/incidents/${incidenteId}/fileAttachments/${adjuntoId}?download`,
      config
    )
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        `Se ha producido un error al intentar acceder a: https://qbe.custhelp.com/services/rest/connect/v1.3/incidents/${incidenteId}//fileAttachments?download`
      )
      console.error(error.message)
    })

  return file
}

const writeAFile = async (file, fileName, incidenteId) => {
  try {
    // Directorio donde se guardarán los archivos para un incidente específico
    const incidenteDir = `./assets/adjuntos/${incidenteId}`

    // Asegurarse de que el directorio exista, si no, créalo
    if (!existsSync(incidenteDir)) {
      mkdirSync(incidenteDir)
    }

    // Ruta completa del archivo, incluyendo el directorio del incidente
    const filePath = join(incidenteDir, fileName)

    // Guardar el archivo en la carpeta específica
    writeFileSync(filePath, file, 'base64url')

    console.log(
      `El archivo ${fileName} se ha guardado exitosamente en ${filePath}`
    )
  } catch (error) {
    console.error('Error al guardar el archivo:', error)
  }
}

function getAllCSV(dirPath) {
  return readdirSync(dirPath, { withFileTypes: true }).reduce(
    (filePaths, dirent) => {
      const entryPath = join(dirPath, dirent.name)
      if (dirent.isFile()) {
        return [...filePaths, entryPath]
      } else if (dirent.isDirectory()) {
        return [...filePaths, ...getAllCSV(entryPath)]
      }
      return filePaths
    },
    []
  )
}

function prueba() {
  const allCSV = getAllCSV('./assets/archivo').filter(
    (file) =>
      basename(file).startsWith('MIGRA_') && basename(file).endsWith('.csv')
  )
  console.log('csv ==>>', allCSV)
}

async function main() {
  const allCSVFile = getAllCSV('./assets/archivo').filter(
    (file) =>
      basename(file).startsWith('MIGRA_') && basename(file).endsWith('.csv')
  )

  for (let i = 0; i < 1; i++) {
    const fileToRead = allCSVFile[i]
    console.log('Leyendo el archivo: ', fileToRead)

    let fileContent = readFileSync(fileToRead, 'utf-8')

    if (fileContent.charCodeAt(0) === 0xfeff) {
      fileContent = fileContent.substring(1)
    }

    const cvsContent = await parse(fileContent, {
      delimiter: ['|'],
      columns: true,
      skip_records_with_empty_values: true
    })

    //console.log('cvsContent ==>>', cvsContent)

    for (let j = 0; j < 5; j++) {
      try {
        const file = await getAFile(
          cvsContent[j].Clave_ajena,
          cvsContent[j].ID_de_archivo_anexo
        )

        if (file) {
          await writeAFile(
            file,
            cvsContent[j].Nombre_de_archivo_de_usuario,
            cvsContent[j].Clave_ajena
          )
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }
}
main()
//prueba()
