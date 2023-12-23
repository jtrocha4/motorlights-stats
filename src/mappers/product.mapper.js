export const productFileToModel = (inventoryFile) => {
  const productFileModel = inventoryFile.map(({
    GrupoDos,
    CódigoInventario,
    Descripción,
    'U Medida': uMedida,
    Existencias,
    Precio,
    Total
  }) => ({
    categoria: GrupoDos,
    codigoInventario: CódigoInventario,
    descripcion: Descripción,
    uMedida,
    existencias: Existencias,
    precio: Precio,
    total: Total
  }))

  return productFileModel
}
