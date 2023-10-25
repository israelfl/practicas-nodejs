# practicas-nodejs
Ejercicios, prácticas y tutoriales sobre nodejs.

## Documentacion y recursos útiles
- [Zod](https://zod.dev/) Librería de validación de datos.
- [Turso](https://turso.tech/) Base de datos mysql gratuita.
- [PokeApi](https://pokeapi.co/) Api de pokemons.
- [Socket.IO](https://socket.io/) Comunicación bidireccional para todas las plataformas. [Enlace NPM](https://www.npmjs.com/package/socket.io).
- [picocolors](https://www.npmjs.com/package/picocolors) Textos en colores para la terminal.
- [fl0](https://www.fl0.com/) Despliega aplicaciones backend y bases de datos en minutos.
- [planetscale](https://planetscale.com/): Plataforma avanzada de MYSQL gratuita (requiere tarjeta credito pero no cargan nada)
  - 5 Gb almacenamiento.
  - 1 Billón de lecturas al mes.
  - 10 Millón de escrituras al mes.
  - 1 rama de producción.
  - 1 rama de desarrollo
## REST Client
[Extensión para Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).

Crea un archivo con la extension [.http](https://github.com/israelfl/practicas-nodejs/blob/main/003-api-rest-cors/api.http) y crea llamadas a endpoints:

```
@vsCodeExtension = https://marketplace.visualstudio.com/items?itemName=humao.rest-client
@baseurl = http://localhost:3000

### Recuperar todas las películas
GET {{baseurl}}/movies

### Recuperar una película por id
GET {{baseurl}}/movies/c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf

### Recuperar todas las películas por un género
GET {{baseurl}}/movies?genre=ACTION

### Crear una película con POST
POST {{baseurl}}/movies
Content-Type: application/json

{
  "sql": "SELECT * FROM users",
  "title": "The Godfather",
  "year": 1975,
  "director": "Francis Ford Coppola",
  "duration": 175,
  "poster": "https://img.fruugo.com/product/4/49/14441494_max.jpg",
  "genre": [
    "Crime",
    "Drama"
  ]
}

### Actualizar una película
PATCH {{baseurl}}/movies/dcdd0fad-a94c-4810-8acc-5f108d3b18c3
Content-Type: application/json

{
  "year": 2022
}
```
