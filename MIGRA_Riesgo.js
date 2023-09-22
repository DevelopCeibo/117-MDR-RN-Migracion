
const fs = require("fs");
const { stringify } = require("csv-stringify");
const filename = "MIGRA_Riesgo.csv";
const writableStream = fs.createWriteStream(filename);




const axios = require('axios');



postRN()


function postRN (){

axios.defaults.headers.common['Authorization'] = "Basic dXN1YXJpby53czpRYmUxMzU3OQ==";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const columns = [
  "Contact",
  "Detalle de Cobertura",
  "Detalle de Riesgo",
  "Estado",
  "Fecha de creación",
  "Fecha de última actualización",
  "ID",
  "IdTipoRiesgo",
  "NumeroPoliza",
  "Patente",
  "Poliza",
  "TomadorRiesgo"
];


const stringifier = stringify({ header: true, columns: columns });

let data = [];
  axios.post('https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults', {
    id: 101736
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


