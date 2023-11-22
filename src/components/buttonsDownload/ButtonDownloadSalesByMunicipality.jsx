import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../../styles/excelStyles'
import { ReportDetailsContext } from '../../context/reportDetails'

const ButtonDownloadSalesByMunicipality = ({ title, sellerSalesData }) => {
  const { dateSaleItemFile } = useContext(ReportDetailsContext)

  const handleDownload = () => {
    const tableHeaders = []
    const wsData = []

    const reportDetailed = [
      [{ v: 'MOTORLIGHTS S.A.S', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Ventas por Municipio', s: excelStyles.reportDetailedStyle }],
      [{ v: `${dateSaleItemFile}`, s: excelStyles.reportDetailedStyle }]
    ]

    tableHeaders.push([
      { v: 'Municipio', s: excelStyles.headerYellowStyle },
      { v: 'Suma de Venta Neta', s: excelStyles.headerYellowStyle }
    ])

    const salesByMunicipalities = {}
    sellerSalesData.forEach(element => {
      const municipality = `${element.departamentoCliente} - ${element.ciudadCliente}`
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
        municipio: { v: municipality, s: excelStyles.whiteRowStyleTextFormat, t: 's' },
        totalVentaNeta: { v: municipalitySale, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' }
      })
    }

    wsData.push({
      municipio: { v: 'Total general', s: excelStyles.headerBlackStyle, t: 's' },
      totalVentaNeta: { v: generalTotalSales, s: excelStyles.blackStyleCurrencyFormat, t: 'n' }
    })

    const worksheet = XLSX.utils.json_to_sheet(wsData, { origin: 'A5' })
    const workbook = XLSX.utils.book_new()
    const sheetName = 'Ventas por Municipio'

    worksheet['!cols'] = []
    const municipalityColumnSize = wsData.reduce((w, r) => Math.max(w, r.municipio.v.length), 10)

    worksheet['!cols'][0] = { wch: municipalityColumnSize + 5 }
    worksheet['!cols'][1] = { wch: 25 }

    worksheet['!autofilter'] = { ref: 'A5:B5' }

    const mergeOptions = {
      '!merge': [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 17 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 17 } }
      ]
    }

    worksheet['!merges'] = mergeOptions['!merge']

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.utils.sheet_add_aoa(worksheet, reportDetailed, { origin: 'A1' })
    XLSX.utils.sheet_add_aoa(worksheet, tableHeaders, { origin: 'A5' })

    const excelFileName = 'Informe Ventas por Municipio.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadSalesByMunicipality