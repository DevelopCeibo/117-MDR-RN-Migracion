
const fs = require("fs");
const { stringify } = require("csv-stringify");
const filename = "MIGRA_LogActividad_v01.csv";
const writableStream = fs.createWriteStream(filename);




const axios = require('axios');



postRN()


function postRN (){

axios.defaults.headers.common['Authorization'] = "Basic dXN1YXJpby53czpRYmUxMzU3OQ==";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const columns = [
  "ID de contacto",
  "ID de incidente",
  "Fecha",
  "Sector",
  "Asesor",
  "Acción realizada",
  "Descripción",
  "ID de tipo de transacción",
  "Inicial",
  "Dirección IP del cliente"
];


const stringifier = stringify({ header: true, columns: columns });

let data = [];
  axios.post('https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults', {
    id: 101742,
    "filters": [
      {
        "name": "id1",
        "values": "4316800" //6106466
      },
      {
        "name": "id2",
        "values": "4315800" //6096469
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


