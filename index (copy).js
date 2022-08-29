const axios = require('axios');
const fs = require('fs');
const productsJson = require("./productos.json");
const nextProductsJson = require("./nextProducts.json");
const urlExists = require("url-exists");
const request = require('request');

const getData = require('./getData.js');
const checkMissingImg = require('./checkMissingImg.js');


const customer = process.env['CUSTOMER']
const key = process.env['KEY']

try {
  getData()
    /*
    .then(data=>{
      checkMissingImg(nextProductsJson.data.productos)
    })
  */
} catch (error) {
  
}





 // .then((productos)=>{
 //        // Separate de data on small chunks
 //        let chunk = [];
 //        const chunkSize = 250;
 //        for (let i = 0; i < productos.data.productos.length; i += chunkSize) {
 //          //chunk.push({"status":200,"message":"exitoso","data":{"productos": productos.data.productos.slice(i, i + chunkSize)}});

 //          fs.writeFile(`chunk${i}.json`, JSON.stringify(chunk), err=>{
 //           if(err){
 //              console.log(err)
 //            }else{
 //              //console.log(`chunk${i}.json created: ${chunk.length} items`)
 //            }


 //            }
 //       return chunk;


