
const fs = require("fs");
const { stringify } = require("csv-stringify");
const filename = "MIGRA_Incidentes.csv";
const writableStream = fs.createWriteStream(filename);




const axios = require('axios');



postRN()


function postRN (){

axios.defaults.headers.common['Authorization'] = "Basic dXN1YXJpby53czpRYmUxMzU3OQ==";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const columns = [
  "Nº de referencia",
  "Actualizado por",
  "Asunto",
  "Buzón de correo",
  "Cola",
  "Creado por cuenta",
  "Modo de Contacto",
  "UsuarioIntra",
  "Tipo de Incidente",
  "Tipo de estado",
  "Tipo Cobro",
  "Siniestro",
  "Poliza",
  "NroCuenta",
  "ID de producto",
  "ID de incidente",
  "ID de disposición",
  "ID de contacto",
  "ID de categoría",
  "Grupo",
  "FechaEfecto",
  "Fecha de última respuesta",
  "Fecha de última actualización",
  "Fecha de creación",
  "Fecha de cierre",
  "Estado",
  "Cuenta asignada",
  "ID de organización"
];


const stringifier = stringify({ header: true, columns: columns });

let data = [];
  axios.post('https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults', {
    id: 101727
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


