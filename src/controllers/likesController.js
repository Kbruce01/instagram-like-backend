import sql from '../config/db.js'
import { createNotification } from './notificationsController.js'

// get likes
export const getLikes = async (c) => {
    try {
        const likes = await sql`SELECT * FROM likes`
        return c.json(likes)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong" }, 500)
    }
};

// get likes by post
export const getLikesByPost = async (c) => {
   try {
        const postId = c.req.param("postId")
        const likes = await sql`SELECT * FROM likes WHERE post_id = ${postId}`

        if (!likes.length) return c.json({ message: "No likes found for this post" }, 404)
        return c.json(likes)

   } catch (error) {
    console.error(error)
    return c.json({ message: "Something went wrong" }, 500)
   }
};

// like post
export const likePost = async (c) => {
    try {
        const payload = c.get("jwtPayload")
        const userId = payload.userId
        const body = await c.req.json()
        const { postId } = body

        const [existingLike] = await sql`SELECT * FROM likes WHERE user_id = ${userId} AND post_id = ${postId}`
        if (existingLike) return c.json({ message: "Already liked" }, 400)

        const [newLike] = await sql`
            INSERT INTO likes (user_id, post_id)
            VALUES (${userId}, ${postId})
            RETURNING *
        `

        await sql`UPDATE posts SET likes_count = likes_count + 1 WHERE id = ${postId}`

        const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`
        if (post) createNotification(post.user_id, userId, "like", postId)

        return c.json(newLike, 201)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong" }, 500)
    }
};

// unlike post
export const unlikePost = async (c) => {
    try {
        const payload = c.get("jwtPayload")
        const userId = payload.userId
        const body = await c.req.json()
        const { postId } = body

        const [like] = await sql`DELETE FROM likes WHERE user_id = ${userId} AND post_id = ${postId} RETURNING *`
        if (!like) return c.json({ message: "Like not found" }, 404)

        await sql`UPDATE posts SET likes_count = likes_count - 1 WHERE id = ${postId}`

        return c.json({ message: "Post unliked successfully" })

    } catch (error) {
        console.error(error) 
        return c.json({ message: "Something went wrong" }, 500)
    }
};