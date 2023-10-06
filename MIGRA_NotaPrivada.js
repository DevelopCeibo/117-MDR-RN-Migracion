
const fs = require("fs");
const { stringify } = require("csv-stringify");
const filename = "MIGRA_NotaPrivada_v01.csv";
const writableStream = fs.createWriteStream(filename);



const axios = require('axios');



postRN()


function postRN (){

axios.defaults.headers.common['Authorization'] = "Basic dXN1YXJpby53czpRYmUxMzU3OQ==";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const columns = [
  "Nº de referencia",
  "ID de incidente",
  "ID de hilo del incidente",
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
    id: 101741,
    "filters": [
      {
        "name": "id1",
        "values": "6106466" //6106466
      },
      {
        "name": "id2",
        "values": "6096469" //6096469
      }
    ]
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


