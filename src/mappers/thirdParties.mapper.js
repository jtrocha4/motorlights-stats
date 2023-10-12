export const thirdPartiesFileToModel = (thirdPartiesFile) => {
  const thirdPartiesFileModel = thirdPartiesFile.map(({
    Ciudad,
    Dirección,
    Identificacion,
    Nombre,
    Teléfonos
  }) => ({
    ciudad: Ciudad,
    direccion: Dirección,
    id: Identificacion,
    nombre: Nombre,
    telefonos: Teléfonos
  }))

  return thirdPartiesFileModel
}
