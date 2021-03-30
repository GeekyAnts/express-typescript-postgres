import multer from 'multer'

export var upload = multer({
	limits: {
		files: 1
	},
	dest: '/tmp/'
})
