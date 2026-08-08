import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { findByEmail, findById, insertUser, isDuplicateKeyError } from './store.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-in-production'
const TOKEN_TTL = '7d'

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_TTL })
}

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    preferredLanguage: user.preferredLanguage,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
  }
}

function validateRegistration({ fullName, email, password }) {
  const errors = []
  if (typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long')
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Please provide a valid email address')
  }
  if (typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter and one number')
  }
  return errors
}

export const authRouter = Router()

authRouter.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password, preferredLanguage } = req.body ?? {}
    const errors = validateRegistration({ fullName, email, password })
    if (errors.length > 0) return res.status(400).json({ message: errors })

    const normalizedEmail = email.trim().toLowerCase()
    if (await findByEmail(normalizedEmail)) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    let user
    try {
      user = await insertUser({
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        preferredLanguage,
      })
    } catch (err) {
      if (isDuplicateKeyError(err)) {
        return res.status(409).json({ message: 'An account with this email already exists.' })
      }
      throw err
    }

    return res.status(201).json({ data: publicUser(user) })
  } catch (err) {
    return next(err)
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {}
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await findByEmail(email.trim().toLowerCase())
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    return res.json({ data: { token: signToken(user), user: publicUser(user) } })
  } catch (err) {
    return next(err)
  }
})

authRouter.post('/me', async (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Authentication required.' })

    let payload
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch {
      return res.status(401).json({ message: 'Invalid or expired session.' })
    }

    const user = await findById(payload.sub)
    if (!user) return res.status(401).json({ message: 'Account no longer exists.' })

    return res.json({ data: { user: publicUser(user) } })
  } catch (err) {
    return next(err)
  }
})
