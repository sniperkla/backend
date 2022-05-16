const moment = require('moment')
function timeConverter (t) {
  const date = moment(t).format('DD-MM-YYYY HH:mm:ss')
  return date
}

function formatDateThai (date) {
  const day = date.format('D')
  const month = moment(date).month()
  const year = moment(date).year() + 543
  const monthTh = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
  const dateThai = `${day} ${monthTh[month]} ${year}`
  const monthThai = `${monthTh[month]} ${year}`
  return { dateThai, monthThai }
}

module.exports = {
  timeConverter,
  formatDateThai
}
