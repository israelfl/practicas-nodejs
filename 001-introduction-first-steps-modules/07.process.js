// argumentos de entrada
// console.log(process.argv)

// controlar el proceso y su salida 0
// 0: todo bien
// 1: ha habido algun error
// process.exit(1)

// podemos controlar eventos del proceso
// process.on('exit', () => {
//   // limpiar los recursos
// })

// current working directory
console.log(process.cwd())

// variables de entorno
console.log(process.env.PEPITO)
