const HTTPStatus = require('http-status')
const orderModel = require('../model/order')
const tokenModel = require('../../admin/model/token')
const menuModel = require('../../admin/model/menu')
const { orderUpdate, calPrice } = require('../service/order')
const { lineNotify } = require('../lib/line')

const getOrder = async (req, res, next) => {
  try {
    const { token } = req.body
    const timeEndDefault = new Date()
    const dataToken = await tokenModel.findOne({ token: token })

    if (!token) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'require data' })
    }

    if (!dataToken) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Token not have' })
    }

    if (timeEndDefault <= dataToken.timeEnd) {
      const order = await orderModel.findOne({ token: token })
      if (order) {
        const menuAll = []
        for (var key in order.waiting) {
          const menuDetailWaitin = await menuModel.findOne({ id: order.waiting[key] })
          menuAll.push(menuDetailWaitin)
        }

        for (var i in order.success) {
          const menuDetailSuccess = await menuModel.findOne({ id: order.success[i] })
          menuAll.push(menuDetailSuccess)
        }

        return res.status(HTTPStatus.CREATED).json({ success: true, data: order, menuAll: menuAll, dataToken: dataToken })
      } else {
        return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'order not have' })
      }
    } else {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Token is expired' })
    }
  } catch (err) {
    return next(err)
  }
}

const createOrder = async (req, res, next) => {
  try {
    const { token, menu } = req.body
    let data = {}
    const timeEndDefault = new Date()
    const dataToken = await tokenModel.findOne({ token: token })

    if (!token || menu.length === 0) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'require data' })
    }

    if (!dataToken) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Token not have' })
    }

    if (timeEndDefault <= dataToken.timeEnd) {
      const order = await orderModel.findOne({ token: token })
      if (!order) {
        const { subTotal, total, menuAllCount } = await calPrice(menu)
        data = {
          token: token,
          table: dataToken.table,
          timeEnd: dataToken.timeEnd,
          waiting: menu,
          subTotal: subTotal,
          total: total
        }
        const dataCreate = await orderModel.create(data)
        lineNotify(dataToken, menuAllCount, total, 'new')
        return res.status(HTTPStatus.CREATED).json({ success: true, data: dataCreate, id: dataToken.idOrder })
      } else {
        return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Order is haved' })
      }
    } else {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Token is expired' })
    }
  } catch (err) {
    return next(err)
  }
}

const updateOrder = async (req, res, next) => {
  try {
    const { token, menu } = req.body
    const timeEndDefault = new Date()
    const dataToken = await tokenModel.findOne({ token: token })

    if (!token || !menu) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'require data' })
    }

    if (!dataToken) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Token not have' })
    }

    if (timeEndDefault <= dataToken.timeEnd) {
      const order = await orderModel.findOne({ token: token })
      if (order) {
        const { subTotal, total } = await calPrice(menu)
        const dataUpdate = await orderModel.findOneAndUpdate({ token: token }, { menu: menu, subTotal: subTotal, total: total })
        return res.status(HTTPStatus.OK).json({ success: true, data: dataUpdate })
      } else {
        return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'order not have' })
      }
    } else {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Token is expired' })
    }
  } catch (err) {
    return next(err)
  }
}

const cancelOrder = async (req, res, next) => {
  try {
    const { token } = req.body
    const dataToken = await tokenModel.findOne({ token: token })

    if (!token) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'require data' })
    }

    if (!dataToken) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Token not have' })
    }
    const order = await orderModel.findOne({ token: token })

    if (order) {
      const dataUpdate = await orderModel.findOneAndUpdate({ token: token }, { status: 'Inactive' })
      return res.status(HTTPStatus.OK).json({ success: true, data: dataUpdate })
    } else {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'order not have' })
    }
  } catch (err) {
    return next(err)
  }
}

const updateMenu = async (req, res, next) => {
  try {
    const { token, menu, type } = req.body
    const timeEndDefault = new Date()
    const dataToken = await tokenModel.findOne({ token: token })

    if (!token || !menu || !type) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'require data' })
    }

    if (!dataToken) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Token not have' })
    }

    if (timeEndDefault <= dataToken.timeEnd) {
      const order = await orderModel.findOne({ token: token })

      if (order) {
        const { waiting, success } = await orderUpdate(order, menu, type)

        const waitingtotal = await calPrice(waiting)
        const successTotal = await calPrice(success)

        const newMenuCount = await calPrice(menu)

        const subTotal = parseFloat(waitingtotal.subTotal) + parseFloat(successTotal.subTotal)
        const total = parseFloat(waitingtotal.total) + parseFloat(successTotal.total)

        const dataUpdate = await orderModel.findOneAndUpdate({ token: token }, { waiting: waiting, success: success, subTotal: subTotal, total: total })
        if (type === 'add') {
          lineNotify(dataToken, newMenuCount.menuAllCount, newMenuCount.total, 'add')
        }

        return res.status(HTTPStatus.OK).json({ success: true, data: dataUpdate })
      } else {
        return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'order not have' })
      }
    } else {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: 'Token is expired' })
    }
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  createOrder,
  updateOrder,
  getOrder,
  cancelOrder,
  updateMenu
}
