const mongoose = require('mongoose')
const Schema = mongoose.Schema

const token = new Schema({
  token: { type: String, required: true },
  idOrder: { type: String, required: true },
  table: { type: String, required: true },
  timeEnd: { type: String, required: true },
  status: { type: String, default: 'Active' }
}, {
  timestamps: true
})

module.exports = mongoose.model('token', token)
