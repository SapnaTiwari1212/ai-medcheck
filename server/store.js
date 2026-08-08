import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aimedcheck'

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  preferredLanguage: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model('User', userSchema)

export async function initStore() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  await User.init()
}

export function isDuplicateKeyError(err) {
  return err?.code === 11000 || err?.name === 'MongoServerError'
}

export async function findByEmail(email) {
  return User.findOne({ email })
}

export async function findById(id) {
  return User.findById(id)
}

export async function insertUser({ fullName, email, passwordHash, preferredLanguage }) {
  return User.create({
    fullName,
    email,
    passwordHash,
    preferredLanguage: preferredLanguage || 'en',
  })
}
