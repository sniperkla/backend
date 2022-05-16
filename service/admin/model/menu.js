const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menu = new Schema({
  type: { type: String, required: true },
  id: { type: String, required: true },
  price: { type: Number, required: true },
  nameEng: { type: String, required: true },
  nameThai: { type: String, required: true },
  details: { type: String, required: true },
  img: { type: String, required: true },
  status: { type: String, default: 'Active' }
}, {
  timestamps: true
})

module.exports = mongoose.model('menu', menu)
