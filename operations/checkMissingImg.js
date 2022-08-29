const fs = require('fs');



const checkMissingImg = async (arr) => {
  let skuList = []

  arr.map(item => {
    if (item.imgUrl == '') {
      return skuList.push(item.sku);
    }
  })

  const listImgMissing = { "total": skuList.length, "skuList": skuList }

  await fs.writeFile("public/missingImgList.json", JSON.stringify(listImgMissing), err => { err ? console.log(err) : console.log("missingImgList created") })

  return await listImgMissing;
}

module.exports = checkMissingImg;