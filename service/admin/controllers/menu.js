const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const multer = require('multer')
const path = require('path')

const s3 = new aws.S3({
  accessKeyId: 'AKIAWSTS4IP3K6DOV47N',
  secretAccessKey: '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',
  Bucket: 'sueasongtua2'
})

const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'sueasongtua2',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
    }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
}).single('BonusImage')

function checkFileType (file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype); if (mimetype && extname) {
    return cb(null, true)
  } else {
    const text = 'Error: Images Only!'
    cb(text)
  }
}

const uploadImageBonus = async (req, res, next) => {
  const id = req.headers.bonusid
  try {
    const findBonus = await Bonus.findOne({ _id: id })
    if (!findBonus) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ message: 'Dont have this bonus' })
    }
    await profileImgUpload(req, res, async (error) => {
      if (error) {
        res.json({ error: error })
      } else {
        if (req.file === undefined) {
          console.log('Error: No File Selected!')
          res.json('Error: No File Selected')
        } else {
          const imageName = req.file.key
          const imageLocation = req.file.location
          await Bonus.findOneAndUpdate({ _id: id }, { img: imageLocation })
          res.json({
            image: imageName,
            location: imageLocation
          })
        }
      }
    })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  uploadImageBonus
}
