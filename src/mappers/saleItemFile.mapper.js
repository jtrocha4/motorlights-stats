export const saleItemFileToModel = (saleItemsFile) => {
  const saleItemFileModel = saleItemsFile.map(({
    Cantidad,
    Descripción,
    Descuento,
    Dias,
    Documento,
    Fecha,
    FormaDePago,
    IVA,
    Tercero,
    'Valor Total': valorTotal,
    'Valor Unit': valorUnitario,
    Vendedor,
    'Venta Bruta': ventaBruta,
    'Venta Neta': ventaNeta
  }) => ({
    cantidad: Cantidad,
    descripcion: Descripción,
    descuento: Descuento,
    dias: Dias,
    doc: Documento,
    fecha: Fecha,
    formaDePago: FormaDePago,
    iva: IVA,
    cliente: Tercero,
    valorTotal,
    valorUnitario,
    vendedor: Vendedor,
    ventaBruta,
    ventaNeta
  }))

  return saleItemFileModel
}
