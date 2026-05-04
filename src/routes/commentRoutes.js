import { Hono } from 'hono'
import { getComments, getCommentsById, createComment, deleteComment, getCommentsByPost } from '../controllers/commentController.js'

const commentRoutes = new Hono()

commentRoutes.get("/", getComments)
commentRoutes.get("/post/:postId", getCommentsByPost)  
commentRoutes.get("/:id", getCommentsById)              
commentRoutes.post("/", createComment)
commentRoutes.delete("/:id", deleteComment)

export default commentRoutes