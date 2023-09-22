
const fs = require("fs");
const { stringify } = require("csv-stringify");
const filename = "MIGRA_NotaPrivada.csv";
const writableStream = fs.createWriteStream(filename);



const axios = require('axios');



postRN()


function postRN (){

axios.defaults.headers.common['Authorization'] = "Basic dXN1YXJpby53czpRYmUxMzU3OQ==";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const columns = [
  "Nº de referencia",
  "Fecha de creación",
  "Fecha de cierre",
  "Modo de Contacto",
  "Jerarquía de categoría",
  "ID de categoría",
  "Estado",
  "Texto"
];


const stringifier = stringify({ header: true, columns: columns });

let data = [];
  axios.post('https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults', {
    id: 101729
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


