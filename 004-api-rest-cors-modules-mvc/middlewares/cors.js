import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'https://movies.com',
  'http://localhost:8080',
  'https://ifldeveloper.xyz'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true)
      }
      if (!origin) {
        return callback(null, true)
      }

      return callback(null, false)
    }
  })
