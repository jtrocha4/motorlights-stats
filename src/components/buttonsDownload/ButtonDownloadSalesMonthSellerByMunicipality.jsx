import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../../styles/excelStyles'
import { ReportDetailsContext } from '../../context/reportDetails'

const ButtonDownloadSalesMonthSellerByMunicipality = ({ title, sellerSalesData, splitName }) => {
  const { dateSaleItemFile } = useContext(ReportDetailsContext)

  const handleDownload = () => {
    const tableHeaders = []
    const wsData = []

    const reportDetailed = [
      [{ v: 'MOTORLIGHTS S.A.S', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Ventas Mes Vendedor Municipio', s: excelStyles.reportDetailedStyle }],
      [{ v: `${dateSaleItemFile}`, s: excelStyles.reportDetailedStyle }]
    ]

    // const allMonth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    // const targetMonth = 10

    // const filteredSalesData = sellerSalesData.filter(el => {
    //   const date = new Date(el.fecha)
    //   const getMonth = date.getMonth()
    //   return allMonth.includes(getMonth)
    // })

    const months = {
      0: 'Enero',
      1: 'Febrero',
      2: 'Marzo',
      3: 'Abril',
      4: 'Mayo',
      5: 'Junio',
      6: 'Julio',
      7: 'Agosto',
      8: 'Septiembre',
      9: 'Octubre',
      10: 'Noviembre',
      11: 'Diciembre'
    }

    const sellersArray = [...new Set(sellerSalesData.map(el => el.vendedor))]
    const allDate = [...new Set(sellerSalesData.map((el) => {
      const date = new Date(el.fecha)
      const getMonth = date.getMonth()
      const getYear = date.getFullYear()
      return `${months[getMonth]} - ${getYear}`
    }))]

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
      const date = new Date(element.fecha)
      const getYear = date.getFullYear()
      const getMonth = date.getMonth()

      const month = `${months[getMonth]} - ${getYear}`

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
      salesByMunicipalities[municipality][seller][month] = (salesByMunicipalities[municipality][seller][month] || 0) + netSale
    })

    allDate.forEach((month) => {
      for (const municipality in salesByMunicipalities) {
        const sellers = salesByMunicipalities[municipality]
        const row = {
          mes: { v: month, s: excelStyles.whiteRowStyleTextFormat },
          municipio: { v: municipality, s: excelStyles.whiteRowStyleTextFormat },
          ...sellersArray.reduce((acc, seller) => {
            acc[seller] = { v: (sellers[seller] && sellers[seller][month]) || 0, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' }
            return acc
          }, {}),
          sumaVentaNeta: {
            v: Object.values(sellersArray).reduce((acc, seller) => acc + (sellers[seller]?.[month] || 0), 0),
            s: excelStyles.yellowStyleCurrencyFormat,
            t: 'n'
          }
        }
        wsData.push(row)
      }
    })

    const totalGeneralRow = {
      mes: { v: '' },
      municipio: { v: 'Total General', s: excelStyles.headerYellowStyle },
      ...sellersArray.reduce((acc, seller) => {
        acc[seller] = { v: totalSalesBySeller[seller] || 0, s: excelStyles.yellowStyleCurrencyFormat, t: 'n' }
        return acc
      }, {}),
      sumaVentaNeta: {
        v: Object.values(totalSalesBySeller).reduce((acc, val) => acc + val, 0) || 0,
        s: excelStyles.yellowStyleCurrencyFormat,
        t: 'n'
      }
    }
    wsData.push(totalGeneralRow)

    const worksheet = XLSX.utils.json_to_sheet(wsData, { origin: 'A5' })
    const workbook = XLSX.utils.book_new()
    const sheetName = 'Ventas Mes Vendedor por Munic'

    worksheet['!cols'] = []
    worksheet['!autofilter'] = { ref: 'A5:J5' }

    const mergeOptions = {
      '!merge': [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } }
      ]
    }

    worksheet['!merges'] = mergeOptions['!merge']

    const monthColumnSize = wsData.reduce((w, r) => Math.max(w, r.mes.v.length), 10)
    const municipalityColumnSize = wsData.reduce((w, r) => Math.max(w, r.municipio.v.length), 10)
    const sellersColumnSizes = sellersArray.map((seller, index) =>
      wsData.reduce((w, r) => Math.max(w, r[seller].v.toString().length), tableHeaders[0][index + 2].v.length)
    )
    const totalColumnSize = wsData.reduce((w, r) => Math.max(w, r.sumaVentaNeta.v.toString().length), tableHeaders[0][sellersArray.length + 2].v.length)

    sellersColumnSizes.forEach((size, index) => {
      worksheet['!cols'][index + 2] = { wch: size + 7 }
    })

    worksheet['!cols'][0] = { wch: monthColumnSize }
    worksheet['!cols'][1] = { wch: municipalityColumnSize }
    worksheet['!cols'][tableHeaders[0].length - 1] = { wch: totalColumnSize + 7 }

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
