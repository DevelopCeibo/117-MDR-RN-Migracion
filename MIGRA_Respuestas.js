
const fs = require("fs");
const { stringify } = require("csv-stringify");
const filename = "MIGRA_Respuesta_v01.csv";
const writableStream = fs.createWriteStream(filename);

const axios = require('axios');

postRN()

function postRN (){

axios.defaults.headers.common['Authorization'] = "Basic dXN1YXJpby53czpRYmUxMzU3OQ==";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const columns = [
  "Nro Incidente",
  "Clave ajena",
  "Cuenta",
  "Fecha de creación",
  "ID de contacto",
  "ID de cuenta de canal",
  "ID de hilo del incidente",
  "Secuencia",
  "Texto",
  "Tipo de entrada de hilo",
  "Peso"
];


const stringifier = stringify({ header: true, columns: columns });

let data = [];
  axios.post('https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults', {
    id: 101740,
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
    console.log(response.data.count, "<<--count--")
     
    const r = response.data.rows.map((row) => {

        stringifier.write(row);
        console.log(row)
        
     })
    console.log(response.data.count, "<<--count--")
    
    
  })
  .catch(function (error) {
    console.log(error);
    
    return error
  });

  stringifier.pipe(writableStream);
  console.log("Finished writing data");


return data;

}


