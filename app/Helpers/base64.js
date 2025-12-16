const fs = require('fs')
const mime = require('mime-types')

const Helpers = use('Helpers')
const Drive = use('Drive')

module.exports = async (fileName) => {
  return new Promise((resolve, reject) => {
    if (fileName) {
      const filePath = Helpers.publicPath('images/' + fileName)

      const exists = Drive.exists(filePath)

      if (exists) {
        fs.readFile(
          filePath, {
            encoding: 'base64'
          },
          (err, base64) => {
            if (err) {
              reject(err)
            } else {
              const fileMimeType = mime.lookup(filePath)

              resolve(`data:${fileMimeType};base64,${base64}`)
            }
          }
        )
      } else {
        reject({
          err: 'File doesn\'t exists'
        })
      }
    } else {
      reject({
        err: 'No file name provided'
      })
    }
  })
}
