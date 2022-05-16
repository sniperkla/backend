const mongoose = require('mongoose')
const Schema = mongoose.Schema

const order = new Schema({
  token: { type: String, required: true },
  table: { type: String, required: true },
  timeEnd: { type: String, required: true },
  waiting: { type: Array },
  success: { type: Array },
  subTotal: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, default: 'Active' }
}, {
  timestamps: true
})

module.exports = mongoose.model('order', order)
