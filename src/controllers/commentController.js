import sql from '../config/db.js'
import { createNotification } from './notificationsController.js'

// get all comments
export const getComments = async (c) => {
    try {
        const comments = await sql`SELECT * FROM comments`
        return c.json(comments)
    } catch (error) {
        console.error(error)
        return c.json({ message: "Failed to get comments" }, 500)
    }
}

// get comment by id
export const getCommentsById = async (c) => {
    try {
        const id = c.req.param("id")
        const [comment] = await sql`SELECT * FROM comments WHERE id = ${id}`
        
        if (!comment) return c.json({ message: "Comment not found" }, 404)
        return c.json(comment)
    } catch (error) {
        console.error(error) 
        return c.json({ message: "Something went wrong" }, 500)
    }
};

// get comments by post
export const getCommentsByPost = async (c) => {
    try {
        const postId = c.req.param("postId")
        const comments = await sql`SELECT * FROM comments WHERE post_id = ${postId}`
        
        if (!comments.length) return c.json({ message: "No comments found for this post" }, 404)
        return c.json(comments)
    } catch (error) {
        console.error(error) 
        return c.json({ message: "Something went wrong" }, 500)
    }
};

// create comment
export const createComment = async (c) => {
    try {
        const body = await c.req.json() 
        const payload = c.get("jwtPayload")
        const userId = payload.userId

        const [newComment] = await sql`
            INSERT INTO comments (post_id, user_id, text)
            VALUES (${body.post_id}, ${userId}, ${body.text})
            RETURNING *
        `

        const [post] = await sql`SELECT * FROM posts WHERE id = ${body.post_id}`
        if (post) createNotification(post.user_id, userId, "comment", body.post_id)

        return c.json(newComment, 201)
    } catch (error) {
        console.error(error)
        return c.json({ message: "Cannot post a comment" }, 500)
    }
};

// delete comment
export const deleteComment = async (c) => {
   try {
        const id = c.req.param("id")
        const [comment] = await sql`DELETE FROM comments WHERE id = ${id} RETURNING *`
        
        if (!comment) return c.json({ message: "Comment not found" }, 404)
        return c.json({ message: "Comment deleted successfully" })
   } catch (error) {
        console.error(error)
        return c.json({ message: "Cannot delete comment" }, 500)
   }
};