import app from './app'
import './database'

app.listen(app.get('port'), 'localhost')
console.log('Server on port', app.get('port'))