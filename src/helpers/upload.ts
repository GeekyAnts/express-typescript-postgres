import multer from 'multer'

export const upload = multer({
  limits: {
    files: 1,
  },
  dest: '/tmp/',
})
