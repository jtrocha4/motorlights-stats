export const collectionFileToModel = (collectionFile) => {
  const collectionFileModel = collectionFile.map(({
    Cliente,
    Empresa,
    Factura,
    Fecha_,
    RC,
    Recaudo,
    Sucursal,
    Vendedor
  }) => ({
    cliente: Cliente,
    empresa: Empresa,
    factura: Factura,
    fecha: Fecha_,
    rc: RC,
    recaudo: Recaudo,
    sucursal: Sucursal,
    vendedor: Vendedor
  }))

  return collectionFileModel
}
