export const creditAndPortfolioFileToModel = (creditAndPortfolioFile) => {
  const creditAndPortfolioFileModel = creditAndPortfolioFile.map(({
    Vendedor,
    Nombres_,
    Dir,
    Documento,
    'Fecha Vencimiento': fechaVencimiento,
    Empresa,
    'Total Mes': totalMes
  }) => ({
    vendedor: Vendedor,
    cliente: Nombres_,
    direccion: Dir,
    doc: Documento,
    fechaVencimiento,
    empresa: Empresa,
    totalMes
  }))
  return creditAndPortfolioFileModel
}
