
const urlExists = require("url-exists");




async function urlExistsPromised(url) {
  return new Promise((resolve, reject) => {
    urlExists(url, (err, exists) => {
      if (err) {
        console.log(err);
        return reject(err);
      }

      resolve(exists);
    })
  });
}

module.exports = urlExistsPromised;