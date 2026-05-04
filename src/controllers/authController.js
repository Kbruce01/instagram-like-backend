import { sign } from 'hono/jwt'
import sql from '../config/db.js'

//register 
export const register = async (c) => {
    const body = await c.req.json()
    const { username, email, password } = body

    const [existingUser] = await sql`SELECT FROM users WHERE email = ${email}`
    if (existingUser) return c.json({ message: "User already exists"}, 400)

    const [newUser] = await sql`
        INSERT INTO users (username, email, password)
        VALUES (${username}, ${email}, ${password})
        RETURNING *
    `

    const { password: _, ...userWithoutPassword } = newUser
    const token = await sign({ userId: newUser.id }, process.env.JWT_SECRET)
    
    return c.json({ user: userWithoutPassword, token }, 201)

};

//login
export const login = async (c) => {
    const body = await c.req.json()
    const { email, password } = body

    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`
    if (!user) return c.json({ message: "User not found" }, 404)

    //console.log('stored password:', user.password)
    //console.log('entered password:', password)

    if (user.password !== password) return c.json({ message: "Invalid password" }, 401)

    const token = await sign({ userId: user.id }, process.env.JWT_SECRET)
    const { password: _, ...userWithoutPassword } = user 
    return c.json({ user: userWithoutPassword, token })
};