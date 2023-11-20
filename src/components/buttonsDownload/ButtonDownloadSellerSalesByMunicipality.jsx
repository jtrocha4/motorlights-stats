import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../../styles/excelStyles'
import { DataExcelContext } from '../../context/dataExcel'

const ButtonDownloadSellerSalesByMunicipality = ({ title, sellerSalesData, splitName }) => {
  const { dateExcel } = useContext(DataExcelContext)

  const handleDownload = () => {
    const tableHeaders = []
    const wsData = []

    const reportDetailed = [
      [{ v: 'MOTORLIGHTS S.A.S', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Ventas Vendedor por Municipio', s: excelStyles.reportDetailedStyle }],
      [{ v: `Entre ${dateExcel.fechaInicial} Y ${dateExcel.fechaFinal}`, s: excelStyles.reportDetailedStyle }]
    ]

    const sellersArray = [...new Set(sellerSalesData.map(el => el.vendedor))]

    tableHeaders.push([
      { v: 'Municipio', s: excelStyles.headerBlackStyle },
      ...sellersArray.map((seller) => ({ v: splitName(seller), s: excelStyles.headerBlackStyle })),
      { v: 'Suma de Venta Neta', s: excelStyles.headerBlackStyle }
    ])

    const salesByMunicipalities = {}
    const totalSalesBySeller = {}
    sellerSalesData.forEach(element => {
      const municipality = `${element.departamentoCliente} - ${element.ciudadCliente}`
      const netSale = element.ventaNeta
      const seller = element.vendedor

      if (!salesByMunicipalities[municipality]) {
        salesByMunicipalities[municipality] = {}
      }
      if (!salesByMunicipalities[municipality][seller]) {
        salesByMunicipalities[municipality][seller] = 0
      }
      if (!totalSalesBySeller[seller]) {
        totalSalesBySeller[seller] = 0
      }
      totalSalesBySeller[seller] += netSale
      salesByMunicipalities[municipality][seller] += netSale
    })

    for (const municipality in salesByMunicipalities) {
      const row = {
        municipio: { v: municipality, s: excelStyles.whiteStyleRow },
        ...sellersArray.reduce((acc, seller) => {
          acc[seller] = { v: salesByMunicipalities[municipality][seller] || 0, s: excelStyles.whiteStyleRowCurrencyFormat, t: 'n' }
          return acc
        }, {}),
        sumaVentaNeta: { v: Object.values(salesByMunicipalities[municipality]).reduce((acc, val) => acc + val, 0) || 0, s: excelStyles.yellowStyleCurrencyFormat, t: 'n' }
      }
      wsData.push(row)
    }

    const totalGeneralRow = {
      municipio: { v: 'Total General', s: excelStyles.yellowStyleRow },
      ...sellersArray.reduce((acc, seller) => {
        acc[seller] = { v: totalSalesBySeller[seller] || 0, s: excelStyles.yellowStyleCurrencyFormat, t: 'n' }
        return acc
      }, {}),
      sumaVentaNeta: { v: Object.values(totalSalesBySeller).reduce((acc, val) => acc + val, 0) || 0, s: excelStyles.yellowStyleCurrencyFormat, t: 'n' }
    }
    wsData.push(totalGeneralRow)

    const worksheet = XLSX.utils.json_to_sheet(wsData, { origin: 'A5' })
    const workbook = XLSX.utils.book_new()
    const sheetName = 'Ventas Vendedor por Municipio'

    worksheet['!cols'] = []
    const municipalityColumnSize = wsData.reduce((w, r) => Math.max(w, r.municipio.v.length), 10)
    const sellersColumnSizes = sellersArray.map((seller, index) =>
      wsData.reduce((w, r) => Math.max(w, r[seller].v.toString().length), tableHeaders[0][index + 1].v.length)
    )
    const totalColumnSize = wsData.reduce((w, r) => Math.max(w, r.sumaVentaNeta.v.toString().length), tableHeaders[0][sellersArray.length + 1].v.length)

    worksheet['!cols'][0] = { wch: municipalityColumnSize + 5 }
    worksheet['!cols'][sellersArray.length + 1] = { wch: totalColumnSize + 5 }

    sellersColumnSizes.forEach((size, index) => {
      worksheet['!cols'][index + 1] = { wch: size }
    })

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
    const excelFileName = 'Informe Ventas Vendedor por Municipio.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadSellerSalesByMunicipality
