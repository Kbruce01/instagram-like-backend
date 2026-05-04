import { notifications } from '../data/notifications.js'
import { Hono } from 'hono'

//get notifications
export const getNotifications = (c) => {
    const payload = c.get("jwtPayload")
    const userId = payload.userId

    const userNotifications = notifications.filter(n => n.userId === userId)
    if (!userNotifications.length) return c.json({ message: "No notifications found" }, 404)
    
    return c.json(userNotifications)
};

//create notfication
export const createNotification = (userId, actorId, type, postId = null) => {
    const newNotification = {
        id: notifications.length + 1,
        userId,
        actorId,
        type,
        postId,
        read: false,
        createdAt: new Date().toISOString()
    }
    notifications.push(newNotification)
};

//mark as read
export const markAsRead = (c) => {
    const id = Number(c.req.param("id"))

    const notification = notifications.find(n => n.id === id)
    if (!notification) return c.json({ message: 'No notification found'}, 404)

    notification.read = true

    return c.json(notification)
};