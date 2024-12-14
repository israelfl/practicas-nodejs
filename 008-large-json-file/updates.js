const original = require('./descarga.json')
const updated = require('./descarga_update.json')

const findChangesComprehensive = (original, updated) => {
  // Crear un mapa a partir del array original para búsquedas rápidas
  const originalMap = new Map(original.map(item => [item.reference, item]))

  const added = []
  const removed = []
  const modified = []

  // Iterar sobre los elementos actualizados
  updated.forEach(updatedEntry => {
    const originalEntry = originalMap.get(updatedEntry.reference)
    if (!originalEntry) {
      // Nuevo registro
      added.push(updatedEntry)
    } else {
      // Registro existente: verificar modificaciones
      if (
        originalEntry.quantity !== updatedEntry.quantity ||
        originalEntry.price !== updatedEntry.price
        // ... otras propiedades a comparar
      ) {
        modified.push(updatedEntry)
      }
      // Eliminar el registro del mapa para optimizar la búsqueda de eliminados
      originalMap.delete(updatedEntry.reference)
    }
  })

  // Los elementos restantes en originalMap son los eliminados
  removed.push(...originalMap.values())

  return { added, removed, modified }
}

function obtenerReferenciasDuplicadas (array) {
  // Convertir el array en un Set para eliminar duplicados basados en la propiedad 'reference'
  const referenciasUnicas = new Set(array.map(item => item.reference))

  // Filtrar el array original para encontrar elementos que no están en el Set
  return array.filter(item => {
    const existe = referenciasUnicas.has(item.reference)
    referenciasUnicas.delete(item.reference) // Eliminar para encontrar el siguiente duplicado
    return !existe
  })
}

const duplicados = obtenerReferenciasDuplicadas(original)
console.log('Duplicados:', duplicados)

const changes = findChangesComprehensive(original, updated)
console.log('Nuevos registros:', changes.added)
console.log('Registros eliminados:', changes.removed)
console.log('Registros modificados:', changes.modified)
