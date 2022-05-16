const lineNotifyResult = require('line-notify-nodejs')('v2zWZwoki7ggIXLHayZaGhiG2eKPa20AFYUa94CHjJh')
const moment = require('moment')
const { formatDateThai } = require('./format')

module.exports = {

  lineNotify: (dataToken, menuAllCount, total, type) => {
    const yesturday = moment()
    const dateThai = formatDateThai(yesturday)

    let str = '\n - สั่งอาหาร'
    if (type === 'add') {
      str = '\n - สั่งอาหารเพิ่ม'
    }

    str = `${str}\n - วันที่ : ${dateThai.dateThai}`
    str = `${str} \n - order id : ${dataToken.idOrder}`

    str = `${str} \n ***************************`

    let menu = ''
    for (const [key, value] of Object.entries(menuAllCount)) {
      menu = `${menu} \n - เมนู :  ${key}`
      menu = `${menu} \n   จำนวน :  ${value}`
    }

    str = `${str}${menu}`
    str = `${str} \n ***************************`
    str = `${str} \n - ราคา ${total} บาท`
    lineNotifyResult.notify({
      message: str
    })
  }

}
