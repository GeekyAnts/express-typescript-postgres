import { Router } from 'express'

import app from './app'
import auth from './auth'
import user from './user'

const router = Router()

router.use('/app', app)

router.use('/auth', auth)

router.use('/user', user)

export default router
