import express from 'express'
import { createUser, getUsers } from '../controllers/regLoginControllers.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.post('/', createUser)
router.get('/', protect,  getUsers)
router.post('/login', loginUser)
export default router