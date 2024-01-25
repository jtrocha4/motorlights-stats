import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../../styles/excelStyles'
import { DataContext } from '../../context/data'

const ButtonDownloadPortfolio = ({ title }) => {
  const { portfolioBehavior } = useContext(DataContext)

  const handleDownload = () => {
    const tableHeaders = []

    const reportDetailed = [
      [{ v: 'MOTORLIGHTS S.A.S', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Comportamiento de Pago', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Entre fecha inicial - fecha final', s: excelStyles.reportDetailedStyle }]
    ]

    tableHeaders.push([
      { v: 'Vendedor', s: excelStyles.headerBlueStyle },
      { v: 'Cliente', s: excelStyles.headerBlueStyle },
      { v: 'Direccion', s: excelStyles.headerBlueStyle },
      { v: 'Documento', s: excelStyles.headerBlueStyle },
      { v: 'Fecha de Vencimiento', s: excelStyles.headerBlueStyle },
      { v: 'Año', s: excelStyles.headerBlueStyle },
      { v: 'Mes', s: excelStyles.headerBlueStyle },
      { v: 'Empresa', s: excelStyles.headerBlueStyle },
      { v: 'Meta', s: excelStyles.headerBlueStyle },
      { v: 'Total Mes', s: excelStyles.headerBlueStyle },
      { v: 'Fecha de Pago', s: excelStyles.headerBlueStyle },
      { v: 'Valor Pago', s: excelStyles.headerBlueStyle },
      { v: 'Diferencia', s: excelStyles.headerBlueStyle },
      { v: 'Dias En Pagar', s: excelStyles.headerBlueStyle },
      { v: 'Dias Sin Pagar', s: excelStyles.headerBlueStyle }
    ])

    const wsData = portfolioBehavior.map(row => ({
      vendedor: { v: row.vendedor, s: excelStyles.whiteRowStyleTextFormat },
      cliente: { v: row.vendedor, s: excelStyles.whiteRowStyleTextFormat },
      direccion: { v: 'Direccion', s: excelStyles.whiteRowStyleTextFormat },
      doc: { v: row.doc, s: excelStyles.whiteRowStyleTextFormat },
      fechaVencimiento: { v: row.fechaVencimiento, s: excelStyles.whiteRowStyleNumberFormat },
      anio: { v: row.anio, s: excelStyles.whiteRowStyleNumberFormat },
      mes: { v: row.mes, s: excelStyles.whiteRowStyleTextFormat },
      empresa: { v: row.empresa, s: excelStyles.whiteRowStyleTextFormat },
      meta: { v: row.meta, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' },
      totalMes: { v: row.totalMes, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' },
      fechaDePago: { v: row.fechaDePago, s: excelStyles.whiteRowStyleNumberFormat },
      valorPago: { v: row.valorPago, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' },
      diferencia: { v: row.diferencia, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' },
      diasEnPagar: { v: row.diasEnPagar, s: excelStyles.whiteRowStyleNumberFormat, t: 'n' },
      diasSinPagar: { v: row.diasSinPagar, s: excelStyles.whiteRowStyleNumberFormat, t: 'n' }
    }))

    const worksheet = XLSX.utils.json_to_sheet(wsData, { origin: 'A5' })
    const workbook = XLSX.utils.book_new()
    const sheetName = 'Cartera'

    // Tamaño de las columnas
    worksheet['!cols'] = []

    const sellerColumnSize = wsData.reduce((w, r) => Math.max(w, r.vendedor.v.length), 10)
    const customerColumnSize = wsData.reduce((w, r) => Math.max(w, r.cliente.v.length), 10)
    const docColumnSize = wsData.reduce((w, r) => Math.max(w, r.doc.v.length), 10)
    const monthColumnSize = wsData.reduce((w, r) => Math.max(w, r.mes.v.length), 10)
    const companyColumnSize = wsData.reduce((w, r) => Math.max(w, r.empresa.v.length), 20)

    worksheet['!cols'][0] = { wch: sellerColumnSize + 5 }
    worksheet['!cols'][1] = { wch: customerColumnSize + 5 }
    worksheet['!cols'][2] = { wch: 15 }
    worksheet['!cols'][3] = { wch: docColumnSize + 5 }
    worksheet['!cols'][4] = { wch: 25 }
    worksheet['!cols'][6] = { wch: monthColumnSize }
    worksheet['!cols'][7] = { wch: companyColumnSize }
    worksheet['!cols'][8] = { wch: 20 }
    worksheet['!cols'][9] = { wch: 20 }
    worksheet['!cols'][10] = { wch: 20 }
    worksheet['!cols'][11] = { wch: 20 }
    worksheet['!cols'][12] = { wch: 20 }
    worksheet['!cols'][13] = { wch: 18 }
    worksheet['!cols'][14] = { wch: 18 }

    worksheet['!autofilter'] = { ref: 'A5:O5' }

    const mergeOptions = {
      '!merge': [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 16 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 16 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 16 } }
      ]
    }

    worksheet['!merges'] = mergeOptions['!merge']

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.utils.sheet_add_aoa(worksheet, reportDetailed, { origin: 'A1' })
    XLSX.utils.sheet_add_aoa(worksheet, tableHeaders, { origin: 'A5' })

    const excelFileName = 'Informe Comportamiento de pago.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }

  return (
    <>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}> {title}</button>
    </>
  )
}

export default ButtonDownloadPortfolio
