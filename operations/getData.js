const axios = require('axios');
const fs = require('fs');
const productsJson = require("../public/productos.json");
const nextProductsJson = require("../public/nextProducts.json");

const urlExistsPromised = require('./urlExistsPromised.js');
require('dotenv').config()

const customer = process.env.CUSTOMER
const key = process.env.KEY
const customerTest = process.env.CUSTOMER_TEST
const keyTest = process.env.KEY_TEST


const getData = async () => {

  if (nextProductsJson.fecha == undefined) {
    return nextProductsJson;
  }

  try {
    // Get data from de API
    const res = await axios.post('https://pchm.to-do.mx/extcust/getprodlist/', {
      "customer": customerTest, "key": keyTest
    })

    const data = await res.data;
    console.log(data)

    if (await data.status != "200") {
      return data;
    } else {

      //fs.writeFile("public/productos.json", JSON.stringify({ "status": 200, "fecha": new Date().toDateString(), "data": { "productos": data.data.productos } }), err => { err ? console.log(err) : console.log("products.json created") })

      if (productsJson.fecha == nextProductsJson.fecha) {
        console.log("Data up to date")
        return nextProductsJson;
      }
      const nextProductPromises = data.data.productos.map(async producto => {

        let sku = producto.sku;

        // Possible URL that work
        let pchUrls = [
          `https://www.pchmayoreo.com/pub/media/catalog/product/${sku.substring(0, 1)}/${sku.substring(1, 2)}/${sku}.jpg`,
          `https://www.pchmayoreo.com/pub/media/catalog/product/${sku.substring(0, 1)}/${sku.substring(1, 2)}/${sku}.jpg`.toLowerCase(),
          //`https://www.pchmayoreo.com/pub/media/catalog/product/${sku.substring(0, 1)}/${sku.substring(1, 2)}/${sku}-01.jpg`.toLowerCase(),
          `https://www.pchmayoreo.com/pub/media/catalog/product/${sku.substring(0, 1)}/${sku.substring(1, 2)}/${sku}.png`,
          `https://www.pchmayoreo.com/pub/media/catalog/product/${sku.substring(0, 1)}/${sku.substring(1, 2)}/${sku}.png`.toLowerCase(),
          `https://www.pchmayoreo.com/pub/media/catalog/product/${sku.substring(0, 1)}/${sku.substring(1, 2)}/${sku}.jpeg`,
          `https://www.pchmayoreo.com/pub/media/catalog/product/${sku.substring(0, 1)}/${sku.substring(1, 2)}/${sku}.jpeg`.toLowerCase()
        ];

        // Iterate the possible URL to identify the one that work
        for (let i = 0; i < pchUrls.length; i++) {
          const url = pchUrls[i]
          const exists = await urlExistsPromised(url);


          if (exists) {
            return {
              ...producto,
              imgUrl: url
            }
          }
        }// end of For

        return {
          ...producto,
          imgUrl: ''
        }
      })// end of map

      const nextProducts = await Promise.all(nextProductPromises);


      fs.writeFile("public/nextProducts.json", JSON.stringify({ "status": 200, "fecha": new Date().toDateString(), "data": { "productos": nextProducts } }), err => { err ? console.log(err) : console.log("nextProducts.json created") })

      return await { "status": 200, "fecha": new Date().toDateString(), "data": { "productos": nextProducts } };
    }

  } catch (e) {
    console.error(`What?`, e);
  }
}


module.exports = getData