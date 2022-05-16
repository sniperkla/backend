const moment = require('moment')
function timeConverter (t) {
  const date = moment(t).format('DD-MM-YYYY HH:mm:ss')
  return date
}

module.exports = {
  timeConverter
}
