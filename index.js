const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const getData = require('./operations/getData.js');
const checkMissingImg = require('./operations/checkMissingImg.js');
require('dotenv').config();
const nextProducts = require('./public/nextProducts.json');

const customer = process.env.CUSTOMER
const key = process.env.KEY
const customerTest = process.env.CUSTOMER_TEST
const keyTest = process.env.KEY_TEST

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  console.log("API STARTED")
  res.sendFile(__dirname + '/views/index.html')
});

// Necessary for the POST
app.use(bodyParser.urlencoded({ extended: false }))

// GET all products with images
app.get('/api/products', async (req, res) => {
  const products = await getData()

  res.json(products)

})

// GET all missing image products
app.get('/api/missingImg', async (req, res) => {
  const data = nextProducts;
  const today = new Date().toDateString();
  if (data.fecha == today) {
    console.log(data.fecha)
  }
  const listImgMissing = await checkMissingImg(data.data.productos)

  return res.json(listImgMissing);

})




const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})