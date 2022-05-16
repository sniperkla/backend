const HTTPStatus = require('http-status')
const menu = require('../model/menu')
const token = require('../model/token')
const Admin = require('../model/admin')
const { v4: uuidv4 } = require('uuid')
const { timeConverter } = require('../lib/format')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { countOrderInDay } = require('../service/order')
const moment = require('moment')

const signup = async (req, res, next) => {
  try {
    // Get user input
    const { adminName, username, password, accessibility } = req.body

    // Validate user input
    if (!(adminName && username && password && accessibility)) {
      res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'All input is required' })
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await Admin.findOne({ username })

    if (oldUser) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'User Already Exist. Please Login' })
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10)

    // Create user in our database
    const user = await Admin.create({
      adminName,
      username,
      accessibility: 'admin',
      password: encryptedPassword
    })

    // Create token
    const token = jwt.sign(
      { user_id: user._id, password },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h'
      }
    )
    // save user token
    user.token = token

    await Admin.findOneAndUpdate({ username: username }, { token: token })
    // return new user
    res.status(HTTPStatus.CREATED).json({ success: true, user })
  } catch (err) {
    return next(err)
  }
}

const login = async (req, res, next) => {
  try {
    // Get user input
    const { username, password } = req.body

    // Validate user input
    if (!(username && password)) {
      res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'All input is required' })
    }
    // Validate if user exist in our database
    const user = await Admin.findOne({ username })

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, password },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h'
        }
      )

      // save user token
      user.token = token

      await Admin.findOneAndUpdate({ username: username }, { token: token })
      // user
      res.status(HTTPStatus.OK).json({ success: true, user })
    }
    res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Invalid Credentials' })
  } catch (err) {
    return next(err)
  }
}

const createToken = async (req, res, next) => {
  try {
    // const { table } = req.body

    // if (!table) {
    //   return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'require data' })
    // }

    const tokenId = uuidv4()
    var today = new Date()

    const start = moment().startOf('day').toDate()
    const end = moment().endOf('day').toDate()
    // const check = await token.findOne({ table: table, status: 'Active' })
    // if (check) {
    //   await token.findOneAndUpdate({ table: table }, { status: 'Inactive' })
    // }

    const id = await countOrderInDay(start, end)

    const timeEnd = today.setHours(today.getHours() + 2)

    const data = {
      idOrder: id,
      token: tokenId,
      table: 'user',
      timeEnd: timeEnd
    }

    await token.create(data)
    const timeEndFormat = timeConverter(timeEnd)
    return res.status(HTTPStatus.CREATED).json({ success: true, data: tokenId, timeEnd: timeEndFormat, idOrder: id })
  } catch (err) {
    return next(err)
  }
}

const updateToken = async (req, res, next) => {
  try {
    const { id, type } = req.body

    if (!id || !type) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'require data' })
    }

    const tokenData = await token.findOneAndUpdate({ _id: id }, { status: 'active' })

    if (tokenData) {
      if (type === 'active') {
        await token.findOneAndUpdate({ _id: id }, { status: 'active' })
      } else {
        await token.findOneAndUpdate({ _id: id }, { status: 'Inactive' })
      }

      return res.status(HTTPStatus.CREATED).json({ success: true })
    } else {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Not have token' })
    }
  } catch (err) {
    return next(err)
  }
}

const listToken = async (req, res, next) => {
  try {
    const dataTokenAll = await token.find()
    return res.status(HTTPStatus.OK).json({ success: true, data: dataTokenAll })
  } catch (err) {
    return next(err)
  }
}

const listMenu = async (req, res, next) => {
  try {
    const dataAll = await menu.find({ status: 'Active' })
    return res.status(HTTPStatus.OK).json({ success: true, data: dataAll })
  } catch (err) {
    return next(err)
  }
}

const deleteMenu = async (req, res, next) => {
  try {
    const body = req.body
    const check = await menu.findOne({ id: body.id })
    if (check) {
      await menu.findOneAndUpdate({ id: body.id }, { status: 'Inactive' })
      return res.status(HTTPStatus.OK).json({ success: true })
    } else {
      return res.status(HTTPStatus.OK).json({ success: false, error: 'no data' })
    }
  } catch (err) {
    return next(err)
  }
}

const addMenu = async (req, res, next) => {
  try {
    const body = req.body
    for (var key in body.data) {
      const obj = body.data[key]

      const type = obj.type ? obj.type : 'undefind'
      const id = obj.id ? obj.id : 'undefind'
      const price = obj.price ? obj.price : 'undefind'
      const nameEng = obj.nameEng ? obj.nameEng : 'undefind'
      const nameThai = obj.nameThai ? obj.nameThai : 'undefind'
      const details = obj.details ? obj.details : 'undefind'
      const img = obj.img ? obj.img : 'undefind'

      const check = await menu.findOne({
        type: type,
        id: id,
        price: price,
        nameEng: nameEng,
        nameThai: nameThai,
        details: details,
        img: img
      })

      if (!check) {
        const data = {
          type: type,
          id: id,
          price: price,
          nameEng: nameEng,
          nameThai: nameThai,
          details: details,
          img: img
        }
        await menu.create(data)
      }
    }
    return res.status(HTTPStatus.CREATED).json({ success: true })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  listMenu,
  addMenu,
  deleteMenu,
  createToken,
  updateToken,
  listToken,
  signup,
  login
}
