const express = require('express')
const router = express.Router()
const admin = require('../controllers/admin')
const auth = require('../../../middleware/auth')

router.route('/signup')
  .post(admin.signup)

router.route('/login')
  .post(admin.login)

router.route('/list/menu')
  .get(admin.listMenu)

router.route('/add/menu')
  .post(auth, admin.addMenu)

router.route('/create/token')
  .post(auth, admin.createToken)

router.route('/update/token')
  .post(auth, admin.updateToken)

router.route('/list/token')
  .get(auth, admin.listToken)

router.route('/delete/menu')
  .post(auth, admin.deleteMenu)

module.exports = router
