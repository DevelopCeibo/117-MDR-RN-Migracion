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
const dotenv = require('dotenv')
const Client = require('ssh2-sftp-client')

dotenv.config()

const sftp = new Client()

const config = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT,
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD
}

const getAFile = async (incidenteId, adjuntoId) => {
  const config = {
    responseType: 'arraybuffer',
    headers: {
      Authorization: process.env.ORACLE_PASSWORD,
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

async function tamanioTotal() {
  let tamanio = 0

  const allCSVFile = await getAllCSV('./assets/archivo').filter(
    (file) =>
      basename(file).startsWith('MIGRA_') && basename(file).endsWith('.csv')
  )

  await allCSVFile.forEach(async (fileToRead) => {
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

    await cvsContent.forEach((cvsRegister) => {
      tamanio += Number(cvsRegister.Tamanio)
    })
  })

  return console.log('El tamaño total es: ', tamanio)
}

async function sendAFile(file, fileName, incidenteId) {
  const remotePath = `sftp/assets/adjuntos/${incidenteId}`
  try {
    const existe = await sftp.exists(remotePath)
    if (!existe) {
      await sftp.mkdir(remotePath, true)
    }
  } catch (err) {
    console.error('Error al intentar crear el directorio', err)
  }

  const filePath = join(remotePath, fileName)

  try {
    await sftp.put(file, filePath)
    console.log(`El archivo se ha enviado exitosamente a ${filePath}`)
  } catch (err) {
    console.error('Error al enviar el archivo:', err)
  }
}

async function main() {
  try {
    await sftp.connect(config)

    const allCSVFile = getAllCSV('./assets/archivo').filter(
      (file) =>
        basename(file).startsWith('MIGRA_') && basename(file).endsWith('.csv')
    )

    for (let i = 0; i < allCSVFile.length; i++) {
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

      for (let j = 0; j < cvsContent.length; j++) {
        try {
          const file = await getAFile(
            cvsContent[j].Clave_ajena,
            cvsContent[j].ID_de_archivo_anexo
          )

          if (file) {
            await sendAFile(
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
    await sftp.end()
  } catch (error) {
    console.error('Error:', error)
  }
}
main()
//tamanioTotal()
