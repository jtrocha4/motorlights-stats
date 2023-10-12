export const departAndMunicFileToModel = (departAndMunicFile) => {
  const departAndMunicFileModel = departAndMunicFile.map(({
    Municipio,
    Departamento
  }) => ({
    municipio: Municipio,
    departamento: Departamento
  }))

  return departAndMunicFileModel
}
