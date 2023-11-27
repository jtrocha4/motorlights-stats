import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../../styles/excelStyles'

import { ReportDetailsContext } from '../../context/reportDetails'

const ButtonDownloadSalesMonthSellerCustomerByMunicipality = ({ title, sellerSalesData, splitName }) => {
  const { dateSaleItemFile } = useContext(ReportDetailsContext)

  const handleDownload = () => {
    const tableHeaders = []
    const wsData = []

    const reportDetailed = [
      [{ v: 'MOTORLIGHTS S.A.S', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Ventas Mes Vendedor Cliente por Municipio', s: excelStyles.reportDetailedStyle }],
      [{ v: `${dateSaleItemFile}`, s: excelStyles.reportDetailedStyle }]
    ]

    const sellersArray = [...new Set(sellerSalesData.map(el => el.vendedor))]
    const customersArray = [...new Set(sellerSalesData.map(el => el.cliente))]

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

    const allDate = [...new Set(sellerSalesData.map((el) => {
      const date = new Date(el.fecha)
      const getMonth = date.getMonth()
      const getYear = date.getFullYear()
      return `${months[getMonth]} - ${getYear}`
    }))]

    tableHeaders.push([
      { v: 'Mes', s: excelStyles.headerBlackStyle },
      { v: 'Cliente', s: excelStyles.headerBlackStyle },
      { v: 'Municipio', s: excelStyles.headerBlackStyle },
      ...sellersArray.map(seller => ({ v: splitName(seller), s: excelStyles.headerBlackStyle })),
      { v: 'Suma de Venta Neta', s: excelStyles.headerBlackStyle }
    ])

    const salesByMunicipalities = {}
    const totalSalesBySeller = {}

    sellerSalesData.forEach(element => {
      const municipality = `${element.departamentoCliente} - ${element.ciudadCliente}`
      const seller = element.vendedor
      const customer = element.cliente
      const date = new Date(element.fecha)
      const getYear = date.getFullYear()
      const getMonth = date.getMonth()
      const netSale = element.ventaNeta

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
      if (!salesByMunicipalities[municipality][seller][month]) {
        salesByMunicipalities[municipality][seller][month] = {}
      }
      totalSalesBySeller[seller] += netSale
      salesByMunicipalities[municipality][seller][month][customer] = (salesByMunicipalities[municipality][seller][month][customer] || 0) + netSale
    })

    customersArray.forEach((customer) => {
      allDate.forEach((month) => {
        for (const municipality in salesByMunicipalities) {
          const sellers = salesByMunicipalities[municipality]
          const row = {
            mes: { v: month, s: excelStyles.whiteRowStyleTextFormat },
            cliente: { v: customer, s: excelStyles.whiteRowStyleTextFormat },
            municipio: { v: municipality, s: excelStyles.whiteRowStyleTextFormat },
            ...sellersArray.reduce((acc, seller) => {
              acc[seller] = { v: (sellers[seller] && sellers[seller][month][customer]) || 0, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' }
              return acc
            }, {}),
            sumaVentaNeta: {
              v: Object.values(sellersArray).reduce((acc, seller) => acc + (sellers[seller]?.[month][customer] || 0), 0),
              s: excelStyles.yellowStyleCurrencyFormat,
              t: 'n'
            }

          }
          wsData.push(row)
        }
      })
    })

    const totalGeneralRow = {
      mes: { v: '' },
      cliente: { v: '' },
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
    const sheetName = 'Ventas Mes Vend Clien por Munic'

    worksheet['!cols'] = []
    worksheet['!autofilter'] = { ref: 'A5:K5' }

    const mergeOptions = {
      '!merge': [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 10 } }
      ]
    }

    worksheet['!merges'] = mergeOptions['!merge']

    const monthColumnSizes = wsData.reduce((w, r) => Math.max(w, r.mes.v.length), 10)
    const customerColumnSizes = wsData.reduce((w, r) => Math.max(w, r.cliente.v.length), 10)
    const municipalityColumnSizes = wsData.reduce((w, r) => Math.max(w, r.municipio.v.length), 10)
    const sellersColumnSizes = sellersArray.map((seller, index) =>
      wsData.reduce((w, r) => Math.max(w, r[seller].v.toString().length), tableHeaders[0][index + 3].v.length)
    )
    const totalColumnSize = wsData.reduce((w, r) => Math.max(w, r.sumaVentaNeta.v.toString().length), tableHeaders[0][tableHeaders[0].length - 1].v.length)

    worksheet['!cols'][0] = { wch: monthColumnSizes }
    worksheet['!cols'][1] = { wch: customerColumnSizes }
    worksheet['!cols'][2] = { wch: municipalityColumnSizes }
    sellersColumnSizes.forEach((size, index) => {
      worksheet['!cols'][index + 3] = { wch: size + 7 }
    })
    worksheet['!cols'][tableHeaders[0].length - 1] = { wch: totalColumnSize + 7 }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.utils.sheet_add_aoa(worksheet, reportDetailed, { origin: 'A1' })
    XLSX.utils.sheet_add_aoa(worksheet, tableHeaders, { origin: 'A5' })
    const excelFileName = 'Informe Ventas Mes Vendedor Cliente por Municipio.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }

  return (
    <>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadSalesMonthSellerCustomerByMunicipality
