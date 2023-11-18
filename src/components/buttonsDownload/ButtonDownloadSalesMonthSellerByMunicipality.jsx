import React from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../../styles/excelStyles'

const ButtonDownloadSalesMonthSellerByMunicipality = ({ title, sellerSalesData, splitName }) => {
  const handleDownload = () => {
    const tableHeaders = []
    const wsData = []

    const reportDetailed = [
      [{ v: 'MOTORLIGHTS S.A.S', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Ventas Mes Vendedor Municipio', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Fecha', s: excelStyles.reportDetailedStyle }]
    ]

    // const allMonth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    // const targetMonth = 10

    // const filteredSalesData = sellerSalesData.filter(el => {
    //   const date = new Date(el.fecha)
    //   const getMonth = date.getMonth()
    //   return allMonth.includes(getMonth)
    // })

    const sellersArray = [...new Set(sellerSalesData.map(el => el.vendedor))]
    const allDate = [...new Set(sellerSalesData.map((el) => el.fecha))]

    tableHeaders.push([
      { v: 'Fecha', s: excelStyles.headerBlackStyle },
      { v: 'Municipio', s: excelStyles.headerBlackStyle },
      ...sellersArray.map(seller => ({ v: splitName(seller), s: excelStyles.headerBlackStyle })),
      { v: 'Suma de Venta Neta', s: excelStyles.headerBlackStyle }
    ])

    const salesByMunicipalities = {}
    const totalSalesBySeller = {}
    sellerSalesData.forEach(element => {
      const municipality = `${element.departamentoCliente} - ${element.ciudadCliente}`
      const netSale = element.ventaNeta
      const seller = element.vendedor
      const date = element.fecha

      if (!salesByMunicipalities[municipality]) {
        salesByMunicipalities[municipality] = {}
      }
      if (!salesByMunicipalities[municipality][seller]) {
        salesByMunicipalities[municipality][seller] = {}
      }
      if (!totalSalesBySeller[seller]) {
        totalSalesBySeller[seller] = 0
      }

      totalSalesBySeller[seller] += netSale
      salesByMunicipalities[municipality][seller][date] = (salesByMunicipalities[municipality][seller][date] || 0) + netSale
    })

    // console.log(salesByMunicipalities)

    allDate.forEach((date) => {
      for (const municipality in salesByMunicipalities) {
        const sellers = salesByMunicipalities[municipality]
        const row = {
          mes: { v: date, s: excelStyles.whiteStyleRow },
          municipio: { v: municipality, s: excelStyles.whiteStyleRow },
          ...sellersArray.reduce((acc, seller) => {
            acc[seller] = { v: (sellers[seller] && sellers[seller][date]) || 0, s: excelStyles.whiteStyleRowCurrencyFormat, t: 'n' }
            return acc
          }, {}),
          sumaVentaNeta: {
            v: Object.values(sellersArray).reduce((acc, seller) => acc + (sellers[seller]?.[date] || 0), 0),
            s: excelStyles.yellowStyleCurrencyFormat,
            t: 'n'
          }
        }
        wsData.push(row)
      }
    })

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
    const sheetName = 'Ventas Mes Vendedor por Munic'

    worksheet['!cols'] = []
    worksheet['!autofilter'] = { ref: 'A5:B5' }

    const mergeOptions = {
      '!merge': [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 17 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 17 } }
      ]
    }

    worksheet['!merges'] = mergeOptions['!merge']

    const municipalityColumnSize = wsData.reduce((w, r) => Math.max(w, r.municipio.v.length), 10)
    const sellersColumnSizes = sellersArray.map((seller, index) =>
      wsData.reduce((w, r) => Math.max(w, r[seller].v.toString().length), tableHeaders[0][index].v.length)
    )
    const totalColumnSize = wsData.reduce((w, r) => Math.max(w, r.sumaVentaNeta.v.toString().length), tableHeaders[0][sellersArray.length + 2].v.length)

    sellersColumnSizes.forEach((size, index) => {
      worksheet['!cols'][index + 2] = { wch: size + 4 }
    })

    worksheet['!cols'][1] = { wch: municipalityColumnSize }
    worksheet['!cols'][sellersArray.length + 2] = { wch: totalColumnSize + 5 }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.utils.sheet_add_aoa(worksheet, reportDetailed, { origin: 'A1' })
    XLSX.utils.sheet_add_aoa(worksheet, tableHeaders, { origin: 'A5' })
    const excelFileName = 'Informe Ventas Mes Vendedor por Municipio.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }

  return (
    <>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadSalesMonthSellerByMunicipality
