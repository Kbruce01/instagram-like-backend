import { Hono } from "hono"
import { getPosts,  getPostById, getPostsByUser, createPost, deletePost } from '../controllers/postController.js'
import { authMiddleware } from '../middleware/auth.js'

const postRoutes = new Hono()

postRoutes.get("/", getPosts)
postRoutes.get("/:id", getPostById)
postRoutes.get("/user/:userId", getPostsByUser)
postRoutes.post("/", authMiddleware, createPost)
postRoutes.delete("/:id", authMiddleware, deletePost)

export default postRoutes