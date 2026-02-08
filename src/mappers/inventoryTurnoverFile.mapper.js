export const inventoryTurnoverFileToModel = (inventoryTurnoverFile) => {
  const inventoryTurnoverFileModel = inventoryTurnoverFile.map(({
    Descripcion_: producto,
    MOTOS: motos,
    CARROS: carros
  }) => ({
    producto,
    motos,
    carros
  }))
  return inventoryTurnoverFileModel
}
