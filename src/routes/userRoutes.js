import { Hono } from "hono"
import { getUsers, getUserById, createUser, deleteUser } from "../controllers/userController.js"

const userRoutes = new Hono()

userRoutes.get("/", getUsers)
userRoutes.get("/:id", getUserById)
userRoutes.post("/", createUser)
userRoutes.delete("/:id", deleteUser)

export default userRoutes