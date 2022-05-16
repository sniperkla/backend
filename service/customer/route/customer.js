const express = require('express')
const router = express.Router()
const customer = require('../controllers/order')

router.route('/get/Order')
  .post(customer.getOrder)

router.route('/update/Order')
  .post(customer.updateOrder)

router.route('/create/Order')
  .post(customer.createOrder)

router.route('/cancel/Order')
  .post(customer.cancelOrder)

router.route('/update/menu')
  .post(customer.updateMenu)

module.exports = router
