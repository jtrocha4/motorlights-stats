export const inventoryTurnoverFileToModel = (inventoryTurnoverFile) => {
  const inventoryTurnoverFileModel = inventoryTurnoverFile.map(({
    Descripcion_: producto
  }) => ({
    producto
  }))
  return inventoryTurnoverFileModel
}
