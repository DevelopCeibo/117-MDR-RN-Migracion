
const fs = require("fs");
const { stringify } = require("csv-stringify");
const filename = "MIGRA_Contactos.csv";
const writableStream = fs.createWriteStream(filename);




const axios = require('axios');



postRN()


function postRN (){

axios.defaults.headers.common['Authorization'] = "Basic dXN1YXJpby53czpRYmUxMzU3OQ==";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const columns = [
  "AceptaEnvioInformacion",
  "Apellido",
  "Calle",
  "Codigo Postal",
  "Conexión",
  "Conflictivo",
  "Correo electrónico no válido",
  "Correo-E alternativo 1",
  "Correo-E alternativo 2",
  "Departamento",
  "Dirección de correo electrónico",
  "Dni",
  "Fecha Alta",
  "Fecha de creación",
  "Fecha de última actualización",
  "FechaRechazoOp",
  "ID de contacto",
  "ID de usuario",
  "ID en AIS",
  "Id en BI",
  "Localidad",
  "Marca_ADS",
  "No Molestar",
  "Nombre",
  "Nombre completo",
  "Número de Domicilio",
  "País",
  "Piso",
  "PolizaVida",
  "PolizaVida2",
  "PolizaVida3",
  "PolizaVida4",
  "Provincia",
  "Teléfono de la oficina sin formato",
  "Teléfono de oficina",
  "Teléfono del asistente",
  "Teléfono del asistente sin formato",
  "Teléfono móvil",
  "Teléfono móvil sin formato",
  "Teléfono particular",
  "Teléfono particular sin formato",
  "TipoDocumento",
  "Vendedor "
];


const stringifier = stringify({ header: true, columns: columns });

let data = [];
  axios.post('https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults', {
    id: 101730
  })
  .then(function (response) {
     const r = response.data.rows.map((row) => {

        stringifier.write(row);
        console.log(row)
        
     })
    
    
  })
  .catch(function (error) {
    console.log(error);
    
    return error
  });

  stringifier.pipe(writableStream);
  console.log("Finished writing data");


return data;

}


