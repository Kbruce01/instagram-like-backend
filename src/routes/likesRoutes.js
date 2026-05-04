import { Hono } from 'hono'
import { getLikes, getLikesByPost, likePost, unlikePost } from '../controllers/likesController.js'

const likesRoutes = new Hono()

likesRoutes.get("/", getLikes)
likesRoutes.get("/post/:postId", getLikesByPost)
likesRoutes.post("/", likePost)
likesRoutes.delete("/", unlikePost)

export default likesRoutes