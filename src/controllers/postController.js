import sql from '../config/db.js'

//get all posts
export const getPosts = async (c) => {
    const posts = await sql`SELECT * FROM posts`
    return c.json(posts)
};

//get post by id
export const getPostById = async (c) => {
    const id = Number(c.req.param("id"))

    const [post] = await sql`SELECT * FROM posts WHERE id = ${id}`
    if (!post) return c.json({ message: "Post not found" }, 404)

    return c.json(post)
};

//get post by user
export const getPostsByUser = async (c) => {
    const userId = Number(c.req.param("userId"))

    const userPosts = await sql`SELECT * FROM posts WHERE user_id = ${userId}`
    if (!userPosts.length) return c.json({ message: "No post found for this user" }, 404)
    
    return c.json(userPosts)
};

//createpost
export const createPost = async (c) => {
    const body = await c.req.json()
    const payload = c.get("jwtPayload")
    const userId = payload.userId

    const [newPost] = await sql`
        INSERT INTO posts (user_id, caption, image_url)
        VALUES (${userId}, ${body.caption}, ${body.image_url})
        RETURNING *
    `
    return c.json(newPost)
};

//delete post 
export const deletePost = async (c) => {
    const id = Number(c.req.param("id"))

    const [post] = await sql`DELETE FROM post WHERE id = ${id} RETURNING *`
    if (!ppost) return c.json({ message: "Post not found" }, 404)

    return c.json({ message: "Post deleted" })
};