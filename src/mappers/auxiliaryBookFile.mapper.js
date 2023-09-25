export const auxiliaryBookFileToModel = (auxiliaryBookFile) => {
  const auxiliaryBookFileModel = auxiliaryBookFile.map(({
    'Doc Num': docNum,
    Cheque,
    Creditos,
    Cuenta,
    Debitos,
    Fecha,
    Nota,
    Saldo,
    Tercero
  }) => ({
    cheque: Cheque,
    creditos: Creditos,
    cuenta: Cuenta,
    debitos: Debitos,
    docNum,
    fecha: Fecha,
    nota: Nota,
    saldo: Saldo,
    tercero: Tercero
  }))

  return auxiliaryBookFileModel
}
