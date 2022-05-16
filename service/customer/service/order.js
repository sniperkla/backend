
const menuModel = require('../../admin/model/menu')
const orderUpdate = async (order, menu, type) => {
  let newWaiting = []
  let newSuccess = []

  const waiting = order.waiting
  const success = order.success

  if (type === 'success') {
    for (var key in order.waiting) {
      const menuWaiting = order.waiting[key]
      for (var i in menu) {
        const check = await menuModel.findOne({ id: menu[i] })
        if (check) {
          if (menuWaiting === menu[i]) {
            success.push(menuWaiting)
          } else {
            newWaiting.push(menuWaiting)
          }
        }
      }
    }
    newSuccess = success
  }

  if (type === 'delete') {
    for (var j in menu) {
      for (var k = 0; k < order.waiting.length; k++) {
        const menuWaiting = order.waiting[k]
        const check = await menuModel.findOne({ id: menu[j] })
        if (check) {
          if (menuWaiting === menu[j]) {
            order.waiting.splice(k, 1)
            k = order.waiting.length
          }
        }
      }
    }
    newWaiting = waiting
  }

  if (type === 'add') {
    newWaiting = waiting
    for (var r in menu) {
      const check = await menuModel.findOne({ id: menu[r] })
      if (check) {
        newWaiting.push(menu[r])
      }
    }
  }

  if (type === 'waiting') {
    for (var q in order.success) {
      const menuSuccess = order.success[q]
      for (var m in menu) {
        const check = await menuModel.findOne({ id: menu[m] })
        if (check) {
          if (menuSuccess === menu[m]) {
            waiting.push(menuSuccess)
          } else {
            newSuccess.push(menuSuccess)
          }
        }
      }
    }
    newWaiting = waiting
  }

  return { waiting: newWaiting, success: newSuccess }
}

const calPrice = async (menuAll) => {
  let subTotal = 0
  const menuDetailAll = []
  for (var key in menuAll) {
    const menuDetail = await menuModel.findOne({ id: menuAll[key] })

    if (menuDetail) {
      subTotal = subTotal + parseFloat(menuDetail.price)
      menuDetailAll.push(menuDetail)
    }
  }

  const total = (parseFloat(subTotal) * 0.07) + parseFloat(subTotal)

  const menuAllCount = menuDetailAll.reduce((menu, curr) => {
    const str = JSON.stringify(curr.nameThai)
    menu[str] = (menu[str] || 0) + 1
    return menu
  }, {})

  return { subTotal, total, menuAllCount }
}

module.exports = {
  orderUpdate,
  calPrice
}
