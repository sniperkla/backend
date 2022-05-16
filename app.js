const express = require('express')
const Mongoose = require('mongoose')
const bodyParser = require('body-parser')
const auth = require('./middleware/auth')

require('dotenv').config()

Mongoose.connect(
  'mongodb://admin:xyz1234AbAb0!@157.230.249.12:27017/officeland',
  {
    useNewUrlParser: true
  }
)

const app = express()
const port = 4050
const routesAdmin = require('./service/admin/route/admin')
const routesCustomer = require('./service/customer/route/customer')

const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('running')
})

app.listen(process.env.PORT, function () {
  console.log('Listening to port 3000')
})

app.use('/api/admin', routesAdmin)
app.use('/api/customer', routesCustomer)

app.post('/welcome', auth, (req, res) => {
  res.status(200).send('Welcome 🙌 ')
})
