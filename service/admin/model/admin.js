const mongoose = require('mongoose')
const Schema = mongoose.Schema

const admin = new Schema({
  adminName: { type: String, default: null },
  username: { type: String, default: null },
  password: { type: String },
  accessibility: { type: String, default: 'admin' },
  token: { type: String }
}, {
  timestamps: true
})

module.exports = mongoose.model('admin', admin)
