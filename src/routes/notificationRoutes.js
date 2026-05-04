import { Hono } from 'hono'
import { getNotifications, markAsRead } from '../controllers/notificationsController.js'
import { authMiddleware } from '../middleware/auth.js'

const notificationRoutes = new Hono()

notificationRoutes.get("/", authMiddleware, getNotifications)
notificationRoutes.put("/:id", authMiddleware, markAsRead)

export default notificationRoutes