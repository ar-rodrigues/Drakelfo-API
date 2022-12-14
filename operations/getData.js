const axios = require('axios');
const fs = require('fs');

const urlExistsPromised = require('./urlExistsPromised.js');
require('dotenv').config();
const nextProducts = require('../public/nextProducts.json');


const customer = process.env.CUSTOMER
const key = process.env.KEY
const customerTest = process.env.CUSTOMER_TEST
const keyTest = process.env.KEY_TEST
const urlTest = "https://pchtest.to-do.mx/extcust/getprodlist/"
const url = "https://pchm.to-do.mx/extcust/getprodlist/"


const getData = async () => {
  console.log("CHEKING IF IS UPDATED")

  const today = new Date().toDateString();
  if (nextProducts.fecha == today) {
    return nextProducts;
  } else {
    console.log("GETTING PRODUCTS")
    try {
      // Get data from de API
      const res = await axios.post(url, {
        "customer": customer, "key": key
      })

      const data = await res.data;
      console.log(data.status)

      fs.writeFile(
        "public/productos.json",
        JSON.stringify({
          ...data, fecha: new Date().toDateString()
        }), err => { err ? console.log(err) : console.log("productos.json created") })

      if (await data.status != "200") {
        return data;
      } else {
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
    }//end of try-catch

  }//end of else


}


module.exports = getData