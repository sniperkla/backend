const Token = require('../model/token')

module.exports = {
  countOrderInDay: async (start, end) => {
    try {
      const countOrder = await Token.find({ createdAt: { $gte: start, $lte: end } })
      return countOrder.length
    } catch (err) {
      return err
    }
  }
}
