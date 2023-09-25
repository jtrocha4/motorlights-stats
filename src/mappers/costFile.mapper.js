export const costFileToModel = (costFile) => {
  const costFileModel = costFile.map(({
    'Costo Unitario': costoUnitario,
    'Total Costo': totalCosto,
    'Unitario Venta': unitarioVentas,
    CódigoInventario,
    Doc,
    Fecha,
    Nombres,
    Unidades,
    Vendedor,
    Ventas
  }) => ({
    clientes: Nombres,
    codigoInventario: CódigoInventario,
    costoUnitario,
    doc: Doc,
    fecha: Fecha,
    totalCosto,
    unidades: Unidades,
    unitarioVentas,
    vendedor: Vendedor,
    ventas: Ventas
  }))

  return costFileModel
}
