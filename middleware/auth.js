const jwt = require('jsonwebtoken')
const HTTPStatus = require('http-status')
const config = process.env

const verifyToken = (req, res, next) => {
  let token = null

  const bearerHeader = req.headers.authorization
  // check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // split the space at the bearer
    const bearer = bearerHeader.split(' ')
    // Get token from string
    const bearerToken = bearer[1]

    // set the token
    token = bearerToken
  }

  if (!token) {
    res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'A token is required for authentication' })
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY)
    req.user = decoded
  } catch (err) {
    res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Invalid Token' })
  }
  return next()
}

module.exports = verifyToken
