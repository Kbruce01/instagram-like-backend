import sql from '../config/db.js'
import { Hono } from 'hono'

// get notifications
export const getNotifications = async (c) => {
    try {
        const payload = c.get("jwtPayload")
        const userId = payload.userId

        const notifications = await sql`SELECT * FROM notifications WHERE user_id = ${userId}`
        if (!notifications.length) return c.json({ message: "No notifications found" }, 404)

        return c.json(notifications)
    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong" }, 500)
    }
};

// mark as read
export const markAsRead = async (c) => {
    try {
        const id = c.req.param("id")

        const [notification] = await sql`
            UPDATE notifications 
            SET read = true 
            WHERE id = ${id} 
            RETURNING *
        `
        if (!notification) return c.json({ message: "Notification not found" }, 404)

        return c.json(notification)
    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong" }, 500)
    }
};

// helper function - no c context
export const createNotification = async (userId, actorId, type, postId = null) => {
    try {
        await sql`
            INSERT INTO notifications (user_id, actor_id, type, post_id)
            VALUES (${userId}, ${actorId}, ${type}, ${postId})
        `
    } catch (error) {
        console.error("Failed to create notification:", error)
    }
};