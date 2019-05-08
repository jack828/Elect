const crypto = require('crypto')

module.exports = () => {
  const saltInt = `${process.pid}${Math.random()}`
  const shaSum = crypto.createHash('sha1').update(saltInt)
  const saltHash = shaSum.digest('hex')
  return saltHash
}
