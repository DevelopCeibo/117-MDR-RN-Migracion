
const fs = require("fs");
const { stringify } = require("csv-stringify");
const filename = "MIGRA_Poliza.csv";
const writableStream = fs.createWriteStream(filename);




const axios = require('axios');



postRN()


function postRN (){

axios.defaults.headers.common['Authorization'] = "Basic dXN1YXJpby53czpRYmUxMzU3OQ==";
axios.defaults.headers.post['Content-Type'] = 'application/json';

const columns = [
  "Acreedor Prendario/Hipotecario",
  "Actualizado por",
  "Bolso_Compra",
  "Canal de cobro",
  "CodigoProductor",
  "Compaña",
  "CondicionDeIVA",
  "Contact",
  "Creado por",
  "E-Cupones",
  "E-Póliza",
  "Estado",
  "Fecha de creación",
  "Fecha De Emisión",
  "Fecha de última actualización",
  "FechaSiniestro",
  "Grupo de afinidad",
  "Grupo Organizador",
  "ID",
  "Numero de cuenta",
  "Numero de Cuenta Enmascarado",
  "Organizador",
  "Póliza",
  "Producto",
  "Productor",
  "SubRamo",
  "Sucursal",
  "Tipo de cuenta",
  "TomadorRiesgo",
  "Vendedor",
  "Vigencia Desde",
  "Vigencia Hasta"
];


const stringifier = stringify({ header: true, columns: columns });

let data = [];
  axios.post('https://qbe.custhelp.com/services/rest/connect/v1.3/analyticsReportResults', {
    id: 101734
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


