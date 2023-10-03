export const newCustomersFileToModel = (customersFile) => {
  const newCustomersFileModel = customersFile.map(({
    Grupo,
    'Tipo ID': tipoId,
    ID,
    Nombre,
    Clasificacion,
    bloqueado,
    'Codigo Ext': codigoExt,
    Creado,
    Actualizado,
    datosactualizados,
    Estado,
    'Listas Precios': listaPrecios
  }) => ({
    // actualizado: Actualizado,
    // bloqueado,
    // clasificacion: Clasificacion,
    cliente: Nombre,
    // codigoExt,
    // creado: Creado,
    datosActualizados: datosactualizados,
    // estado: Estado,
    // grupo: Grupo,
    id: ID
    // listaPrecios
  }))

  return newCustomersFileModel
}
