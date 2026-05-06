import sql from '../config/db.js'

//get all posts
export const getPosts = async (c) => {
    try {
        const posts = await sql`SELECT * FROM posts`
        return c.json(posts)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Cannot get post" }, 500)
    }
};

//get post by id
export const getPostById = async (c) => {
    try {
        const id = Number(c.req.param("id"))

        const [post] = await sql`SELECT * FROM posts WHERE id = ${id}`
        if (!post) return c.json({ message: "Post not found" }, 404)

        return c.json(post)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Cannot get post" }, 500)
    }
};

//get post by user
export const getPostsByUser = async (c) => {
    try {
        const userId = Number(c.req.param("userId"))

        const userPosts = await sql`SELECT * FROM posts WHERE user_id = ${userId}`
        if (!userPosts.length) return c.json({ message: "No post found for this user" }, 404)
        
        return c.json(userPosts)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Something went wrong" }, 500)
    }
};

//createpost
export const createPost = async (c) => {
    try {
        const body = await c.req.json()
        const payload = c.get("jwtPayload")
        const userId = payload.userId

        const [newPost] = await sql`
            INSERT INTO posts (user_id, caption, image_url)
            VALUES (${userId}, ${body.caption}, ${body.image_url})
            RETURNING *
        `
        return c.json(newPost)

    } catch (error) {
        console.error(error)
        return c.json({ message: "Cannot create post " }, 500)
    }
};

//delete post 
export const deletePost = async (c) => {
    try {
        const id = Number(c.req.param("id"))

        const [post] = await sql`DELETE FROM posts WHERE id = ${id} RETURNING *`
        if (!post) return c.json({ message: "Post not found" }, 404)

        return c.json({ message: "Post deleted" })

    } catch (error) {
        console.error(error)
        return c.json({ message: "Cannot delete post" }, 500)
    }
};