import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Fractal1976',
  database: 'moviesdb'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
const connection = await mysql.createConnection(connectionString)

const queryBase = `SELECT BIN_TO_UUID ( movie.id ) id,
movie.title,
movie.year,
movie.director,
movie.duration,
movie.poster,
movie.rate,
CAST(CONCAT('["', REPLACE(GROUP_CONCAT(genre.name), ',', '","'), '"]') AS JSON) genre
FROM movie
LEFT JOIN movie_genres ON BIN_TO_UUID ( movie.id ) = BIN_TO_UUID ( movie_genres.movie_id )
LEFT JOIN genre ON movie_genres.genre_id = genre.id`

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const [genreMovies] = await connection.query(
        `${queryBase}
        GROUP BY movie.id
        HAVING LOWER( genre ) LIKE ?;`,
        [`%${genre.toLowerCase()}%`]
      )
      return genreMovies
    }
    const [movies] = await connection.query(
      `${queryBase}
      GROUP BY movie.id;`
    )

    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      `${queryBase}
      WHERE movie.id = UUID_TO_BIN(?)
      GROUP BY movie.id;`,
      [id]
    )

    if (movies.length === 0) return []

    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // todo: crear la conexión de genre

    // crypto.randomUUID()
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // puede enviarle información sensible
      throw new Error('Error creating movie')
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return movies[0]
  }

  static async delete ({ id }) {}

  static async update ({ id, input }) {}
}
