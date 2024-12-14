const sqlite3 = require('sqlite3').verbose()

function csvToSqlite (csvFilePath, dbFilePath, tableName) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFilePath, err => {
      if (err) {
        reject(err)
      } else {
        const fs = require('fs')
        const csv = require('csv-parser')
        const results = []

        fs.createReadStream(csvFilePath)
          .pipe(csv({ separator: ';' })) // Specify the delimiter as semicolon
          .on('data', data => {
            data.Descripcion = data.Descripcion.replace(
              /(?:\[rn]|[\r\n]+)+/g,
              ' '
            )
            return results.push(data)
          })
          .on('end', () => {
            // Create the table
            const columns = Object.keys(results[0])
              .map(col => `${col} TEXT`)
              .join(',')

            const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`
            db.run(createTableQuery, err => {
              if (err) {
                reject(err)
              } else {
                // Insert data
                try {
                  db.run('BEGIN TRANSACTION;')
                  const insertQuery = `INSERT INTO ${tableName} VALUES (${Object.values(results[0])
                    .map((item) => {
                      console.log('item', item)
                      return '?'
                    })
                    .join(',')})`
                  console.log(insertQuery)

                  db.serialize(() => {
                    const stmt = db.prepare(insertQuery)
                    results.forEach(row => {
                      stmt.run(Object.values(row))
                    })
                    stmt.finalize()
                    db.close()
                    resolve()
                  })
                } catch (error) {
                  console.log('hola', error, results[0])
                }
              }
            })
          })
      }
    })
  })
}

// Example usage
csvToSqlite('./occsportProducts.csv', './database.db', 'csv')
  .then(() => console.log('CSV imported successfully!'))
  .catch(err => console.error('Error importing CSV:', err))
