import sql from '../config/db.js'
import { createNotification } from './notificationsController.js'

//getfollowers
export const getFollowers = async (c) => {
    try {
        const followingId = Number(c.req.param("followingId"))
        const followers = await sql`SELECT * FROM followers WHERE following_id = ${followingId}`

        if (!followers.length) return c.json({ message: "No followers obtaines" })
        
            return c.json(followers)
    } catch (error) {
        console.error(error) 
        return c.json({ message: "Cannot get followers" }, 500)
    }
    
};

//get following 
export const getFollowing = async (c) => {
    try {
        const followerId = Number(c.req.param("followerId"))
        const following = await sql`SELECT * FROM followers WHERE follower_id = ${followerId}`

        if (!following.length) return c.json({ message: "Not following anyone" }, 404)

        return c.json(following)
    } catch (error) {
        console.error(error)
        return c.json({ message: "Cannot get following" }, 500)
    }
};

//follow a user 
export const followUser = async (c) => {
    try {
        const payload = c.get("jwtPayload")
        const followerId = payload.userId  
        const body = await c.req.json()
        const { followingId } = body  

        
        const [existingFollow] = await sql`SELECT * FROM followers WHERE follower_id = ${followerId} AND following_id = ${followingId}`
        if (existingFollow) return c.json({ message: "Already following" }, 400)

        const [newFollow] = await sql`
            INSERT INTO followers (follower_id, following_id)
            VALUES (${followerId}, ${followingId})
            RETURNING *
        `

        createNotification(followingId, followerId, "follow", null)
        return c.json(newFollow, 201)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Cannot follow user" }, 500)
    }
};

//unfollow a user 
export const unfollowUser = async (c) => {
    try {
        const payload = c.get("jwtPayload")
        const followerId = payload.userId
        const body = await c.req.json()
        const { followingId } = body

        const [follow] = await sql`
            DELETE FROM followers 
            WHERE follower_id = ${followerId} AND following_id = ${followingId} 
            RETURNING *
        `
        if (!follow) return c.json({ message: "Not following this user" }, 404)

        return c.json({ message: "User unfollowed successfully" })

    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong" }, 500)
    }
};
