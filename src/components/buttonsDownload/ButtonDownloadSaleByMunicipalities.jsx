import React from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../../styles/excelStyles'

const ButtonDownloadSaleByMunicipalities = ({ title, sellerSalesData }) => {
  const handleDownload = () => {
    const tableHeaders = []
    const wsData = []

    tableHeaders.push([
      { v: 'Departamento', s: excelStyles.headerYellowStyle },
      { v: 'Suma de Venta Neta', s: excelStyles.headerYellowStyle }
    ])

    const salesByMunicipalities = {}
    sellerSalesData.forEach(element => {
      const municipality = element.ciudadCliente
      const netSale = element.ventaNeta
      if (!salesByMunicipalities[municipality]) {
        salesByMunicipalities[municipality] = 0
      }
      salesByMunicipalities[municipality] += netSale
    })

    let generalTotalSales = 0

    for (const key in salesByMunicipalities) {
      const municipality = key
      const municipalitySale = salesByMunicipalities[key]
      generalTotalSales += municipalitySale
      wsData.push({
        municipio: { v: municipality, s: excelStyles.whiteStyleRow },
        totalVentaNeta: { v: municipalitySale, s: excelStyles.whiteStyleRowCurrencyFormat, t: 'n' }
      })
    }

    wsData.push({
      municipio: { v: 'Total general', s: excelStyles.headerBlackStyle },
      totalVentaNeta: { v: generalTotalSales, s: excelStyles.blackStyleCurrencyFormat, t: 'n' }
    })

    const worksheet = XLSX.utils.json_to_sheet(wsData)
    const workbook = XLSX.utils.book_new()
    const sheetName = 'Ventas por Municipio'

    worksheet['!cols'] = []
    const municipalityColumnSize = wsData.reduce((w, r) => Math.max(w, r.municipio.v.length), 10)

    worksheet['!cols'][0] = { wch: municipalityColumnSize + 5 }
    worksheet['!cols'][1] = { wch: 25 }

    worksheet['!autofilter'] = { ref: 'A1:B1' }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.utils.sheet_add_aoa(worksheet, tableHeaders, { origin: 'A1' })
    const excelFileName = 'Informe Ventas por Municipio.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadSaleByMunicipalities
