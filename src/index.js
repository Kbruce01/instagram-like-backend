import { Hono } from "hono"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import likesRoutes from "./routes/likesRoutes.js"
import followersRoutes from './routes/followerRoutes.js'
import authRoutes from './routes/authRoutes.js'
import feedRoutes from './routes/feedRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import './config/redis.js'
import './config/db.js'

const app = new Hono()

app.route("/api/users", userRoutes)
app.route("/api/posts", postRoutes)
app.route("/api/comments", commentRoutes)
app.route("/api/likes", likesRoutes)
app.route("/api/followers", followersRoutes)
app.route("/api/auth", authRoutes)
app.route("/api/feed", feedRoutes)
app.route("/api/notifications", notificationRoutes)

const server = Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT || 3000
})

console.log(`Server running at http://localhost:${server.port}`)