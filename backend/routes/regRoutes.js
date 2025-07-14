import express from 'express'
import { createUser, forgotPassword, getUsers, loginUser, resetPassword } from '../controllers/regLoginControllers.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.post('/', createUser)
router.get('/', protect,  getUsers)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

export default router