
const fs = require("fs");
const { stringify } = require("csv-stringify");
const filename = "MIGRA_Organizaciones.csv";
const writableStream = fs.createWriteStream(filename);




const axios = require('axios');



postRN()


function postRN (){

axios.defaults.headers.common['Authorization'] = "Basic dXN1YXJpby53czpRYmUxMzU3OQ==";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const columns = [
  "Estado",
  "Fecha de creación",
  "Fecha de última actualización",
  "ID de organización",
  "Jerarquía de organización - Nivel 1",
  "Nombre de organización",
  "Vendedor "
];


const stringifier = stringify({ header: true, columns: columns });

let data = [];
  axios.post('https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults', {
    id: 101733
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


