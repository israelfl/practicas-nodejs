const { pipeline, Transform } = require('node:stream')
const fs = require('node:fs')

const { streamArray } = require('stream-json/streamers/StreamArray')
const Batch = require('stream-json/utils/Batch')
const { parser } = require('stream-json')

const sqlite = require('sqlite3')

const dbPath = './database.db' // Path to the database file

// Connect to the database in a physical file
const db = new sqlite.Database(dbPath)

const initializeDataBase = () => {
  db.run('DROP TABLE IF EXISTS products')
  // Define the SQL statement to create a table
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL
    )`

  // Execute the SQL statement to create the table
  db.run(createTableSql, err => {
    if (err) {
      return console.error('Error creating table:', err.message)
    }
    console.log('Table created successfully')
    pipeline(
      // read from file
      fs.createReadStream('descarga.json'),
      // parse JSON
      parser(),
      // takes an array of objects and produces a stream of its components
      streamArray(),
      // batches items into arrays
      new Batch({ batchSize: 50000 }),
      customTransformer,
      err => {
        if (err) {
          console.error('Pipeline failed', err)
        } else {
          console.log('Pipeline succeeded')
        }
      }
    )
  })
}

const insertData = async element => {
  const { reference, quantity, price } = element
  try {
    // Insert data into the products table
    db.run(
      'INSERT INTO products (reference, quantity, price) VALUES (?, ?, ?)',
      [reference, quantity, price]
    )
    // console.log('Data inserted successfully')
  } catch (error) {
    console.error('Error inserting data:', error)
  }
}

const logMemory = () =>
  console.log(
    `Memory usage: ${
      Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100
    } MB`
  )

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const customTransformer = new Transform({
  objectMode: true, // to accept arrays
  transform: async (chunk, encoding, cb) => {
    logMemory()
    db.run('BEGIN TRANSACTION;')
    chunk.forEach(element => {
      insertData(element.value)
    })
    db.run('COMMIT TRANSACTION;')
    console.log('chunk length: ', chunk.length)
    await sleep(500)
    cb()
  }
})

initializeDataBase()
