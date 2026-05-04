import { Hono } from 'hono'
import { getFeed } from '../controllers/feedController.js'
import { authMiddleware } from '../middleware/auth.js'

const feedRoutes = new Hono()

feedRoutes.get("/", authMiddleware, getFeed)

export default feedRoutes