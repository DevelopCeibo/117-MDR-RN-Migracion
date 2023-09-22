
const fs = require("fs");
const { stringify } = require("csv-stringify");
const filename = "MIGRA_Siniestro.csv";
const writableStream = fs.createWriteStream(filename);




const axios = require('axios');



postRN()


function postRN (){

axios.defaults.headers.common['Authorization'] = "Basic dXN1YXJpby53czpRYmUxMzU3OQ==";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const columns = [
  "Apellido Conductor",
  "Apellido y Nombre",
  "Calle",
  "Causa",
  "Codigo de Productor",
  "Código Postal",
  "Código Producto",
  "Comiseria",
  "Contact",
  "Daños Propios",
  "Daños Terceros",
  "DocumentoConductor",
  "Estado",
  "Fecha de creación",
  "Fecha De Siniestro",
  "Fecha de última actualización",
  "Fecha_Siniestro",
  "Hora",
  "ID",
  "Lesiones Terceros",
  "Localidad",
  "Nombre Conductor",
  "Numero",
  "Numero de Documento",
  "Número de Siniestro",
  "Numero de Siniestro",
  "Oficina",
  "País",
  "Poliza",
  "Producto",
  "Productor",
  "Provincia",
  "Responsable",
  "Tomador / Riesgo"
];


const stringifier = stringify({ header: true, columns: columns });

let data = [];
  axios.post('https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults', {
    id: 101737
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


