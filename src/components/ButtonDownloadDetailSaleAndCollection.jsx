import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../styles/excelStyles'
import { DataContext } from './context/data'

const ButtonDownloadDetailSaleAndCollection = ({ title, data, convertExcelDateToReadable }) => {
  const { dateExcel, errorRc, dataCollection } = useContext(DataContext)

  const excelPercentageFormat = (percentageValue) => {
    const percentage = parseFloat(percentageValue / 100)
    return percentage
  }

  const handleDownload = () => {
    const headers = ['Vendedor', 'Facturas', 'Meta de Venta', 'Venta (Sin flete)', 'Ventas Pendientes', '% Venta', 'Meta de Recaudo', 'Recaudo', 'Recaudo Pendientes', '% Recaudo']

    const wsData = []

    headers.forEach(header => {
      let row = [header]
      const cellValue = { v: '', s: {} }
      if (header === 'Vendedor') {
        cellValue.v = header
      }
      row = [cellValue]
      data.forEach(element => {
        const cellElement = { v: '', s: {} }
        if (header === 'Vendedor') {
          cellElement.v = element.vendedor
        }
        row.push(cellElement)
      })
      wsData.push(row)
    })

    const sellerData = {}
    const sellerWsData = {}
    const sellerName = wsData[0].map(el => el.v)

    const sellerDataSale = {}
    const sellerWsDataSale = {}

    const sellerDataCollection = {}
    const sellerWsDataCollection = {}

    sellerName.filter(seller => seller !== 'Vendedor').forEach(seller => {
      sellerData[seller] = []
      sellerWsData[seller] = []

      sellerDataSale[seller] = []
      sellerWsDataSale[seller] = []

      sellerDataCollection[seller] = []
      sellerWsDataCollection[seller] = []
    })

    for (const key in data) {
      const seller = data[key].vendedor
      const sale = data[key].venta
      if (sellerData[seller]) {
        sellerData[seller].push(data[key])
      }
      if (sellerDataSale[seller]) {
        if (sale !== undefined) {
          sale.forEach(element => {
            sellerDataSale[seller].push(element)
          })
        }
      }
    }

    for (const key in dataCollection) {
      const seller = dataCollection[key].vendedor
      const collection = dataCollection[key].recaudo
      if (sellerDataCollection[seller]) {
        collection.forEach(element => {
          sellerDataCollection[seller].push(element)
        })
      }
    }

    for (const key in data) {
      const seller = data[key].vendedor
      if (sellerWsData[seller]) {
        headers.forEach(header => {
          let row = [header]
          const cellHeader = { v: '', s: {} }
          if (header === 'Vendedor') {
            cellHeader.v = header
            cellHeader.s = excelStyles.headerYellowStyle
          }
          if (header === 'Facturas') {
            cellHeader.v = header
            cellHeader.s = excelStyles.headerYellowStyle
          }
          if (header === 'Meta de Venta') {
            cellHeader.v = header
            cellHeader.s = excelStyles.headerYellowStyle
          }
          if (header === 'Venta (Sin flete)') {
            cellHeader.v = header
            cellHeader.s = excelStyles.headerYellowStyle
          }
          if (header === 'Ventas Pendientes') {
            cellHeader.v = header
            cellHeader.s = excelStyles.headerYellowStyle
          }
          if (header === '% Venta') {
            cellHeader.v = header
            cellHeader.s = excelStyles.headerYellowStyle
          }
          if (header === 'Meta de Recaudo') {
            cellHeader.v = header
            cellHeader.s = excelStyles.headerYellowStyle
          }
          if (header === 'Recaudo') {
            cellHeader.v = header
            cellHeader.s = excelStyles.headerYellowStyle
          }
          if (header === 'Recaudo Pendientes') {
            cellHeader.v = header
            cellHeader.s = excelStyles.headerYellowStyle
          }
          if (header === '% Recaudo') {
            cellHeader.v = header
            cellHeader.s = excelStyles.headerYellowStyle
          }
          row = [cellHeader]

          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {}, t: '' }
            if (header === 'Vendedor') {
              cellElement.v = element.vendedor
              cellElement.s = excelStyles.whiteStyle
            }
            if (header === 'Facturas') {
              cellElement.v = element.cantidadFacturas
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyle
            }
            if (header === 'Meta de Venta') {
              cellElement.v = element.metaVentas
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (header === 'Venta (Sin flete)') {
              cellElement.v = element.totalVenta
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (header === 'Ventas Pendientes') {
              cellElement.v = parseFloat(element.metaVentas - element.totalVenta)
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (header === '% Venta') {
              cellElement.v = excelPercentageFormat(element.porcentajeVentas)
              cellElement.t = 'n'
              cellElement.s = excelStyles.percentageGrayStyle
            }
            if (header === 'Meta de Recaudo') {
              cellElement.v = element.metaRecaudoSinIva
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (header === 'Recaudo') {
              cellElement.v = element.totalRecaudo
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (header === 'Recaudo Pendientes') {
              cellElement.v = parseFloat(element.metaRecaudoSinIva - element.totalRecaudo)
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (header === '% Recaudo') {
              cellElement.v = excelPercentageFormat(element.porcentajeRecaudo)
              cellElement.t = 'n'
              cellElement.s = excelStyles.percentageGrayStyle
            }
            row.push(cellElement)
          })
          sellerWsData[seller].push(row)
        })
      }
    }

    // Tabla Detalle Ventas
    const salesDetailTableHeaders = []
    salesDetailTableHeaders.push([
      { v: 'Detalle Ventas', s: excelStyles.headerYellowStyle }
    ])
    salesDetailTableHeaders.push([
      { v: 'Fecha', s: excelStyles.headerYellowStyle },
      { v: 'Nombre', s: excelStyles.headerYellowStyle },
      { v: 'Ventas', s: excelStyles.headerYellowStyle }
    ])

    for (const key in data) {
      const seller = data[key].vendedor
      const customer = []
      const totalSalesPerCustomer = []
      const dateSalesPerCustomer = []

      if (sellerWsData[seller]) {
        customer[seller] = []
        sellerDataSale[seller].forEach(element => {
          if (totalSalesPerCustomer[element.cliente]) {
            totalSalesPerCustomer[element.cliente] += element.ventas
            dateSalesPerCustomer[element.cliente] = element.fecha
          } else {
            totalSalesPerCustomer[element.cliente] = element.ventas
            dateSalesPerCustomer[element.cliente] = element.fecha
          }
        })
      }

      for (const key in customer) {
        const seller = key
        let total = 0
        for (const key in totalSalesPerCustomer) {
          for (const keyDateSalesPerCustomer in dateSalesPerCustomer) {
            if (sellerWsDataSale[seller]) {
              if (keyDateSalesPerCustomer === key) {
                const date = dateSalesPerCustomer[keyDateSalesPerCustomer]
                const totalSales = totalSalesPerCustomer[key]
                total += totalSales
                sellerWsDataSale[seller].push([
                  { v: convertExcelDateToReadable(date), s: excelStyles.whiteStyle },
                  { v: key, s: excelStyles.whiteStyle },
                  { v: totalSales, s: excelStyles.yellowStyleCurrencyFormat, t: 'n' }
                ])
              }
            }
          }
        }
        sellerWsDataSale[seller].push([
          { v: 'Total', s: excelStyles.headerBlackStyle },
          { v: '', s: excelStyles.headerBlackStyle },
          { v: total, s: excelStyles.blackStyleCurrencyFormat, t: 'n' }
        ])
      }
    }

    // Tabla Detalle Gestion Cobranza
    const collectionDetailTableHeaders = []
    collectionDetailTableHeaders.push([
      { v: 'Detalle Archivo Gestion De Cobranza', s: excelStyles.headerYellowStyle }
    ])
    collectionDetailTableHeaders.push([
      { v: 'Fecha', s: excelStyles.headerYellowStyle },
      { v: 'Factura', s: excelStyles.headerYellowStyle },
      { v: 'Cliente', s: excelStyles.headerYellowStyle },
      { v: 'Valor', s: excelStyles.headerYellowStyle }
    ])

    for (const key in dataCollection) {
      const seller = dataCollection[key].vendedor
      const equalRc = []
      let total = 0

      if (sellerWsDataCollection[seller]) {
        sellerDataCollection[seller].forEach(element => {
          const rc = element.rc
          const bill = element.factura
          const collectionWithoutVAT = element.recaudo / 1.19
          if (!equalRc[rc]) {
            equalRc[rc] = {
              vendedor: element.vendedor,
              cliente: element.cliente,
              rc: element.rc,
              fecha: element.fecha,
              factura: element.factura,
              recaudo: collectionWithoutVAT
            }
          } else {
            equalRc[rc].factura += ' - ' + bill
          }
        })
        const res = Object.values(equalRc)

        res.forEach(element => {
          total += element.recaudo
          sellerWsDataCollection[seller].push([
            { v: convertExcelDateToReadable(element.fecha), s: excelStyles.whiteStyle },
            { v: element.factura, s: excelStyles.whiteStyle },
            { v: element.cliente, s: excelStyles.whiteStyle },
            { v: element.recaudo, s: excelStyles.yellowStyleCurrencyFormat, t: 'n' }
          ])
        })
        sellerWsDataCollection[seller].push([
          { v: 'Total', s: excelStyles.headerBlackStyle },
          { v: '', s: excelStyles.headerBlackStyle },
          { v: '', s: excelStyles.headerBlackStyle },
          { v: total, s: excelStyles.blackStyleCurrencyFormat, t: 'n' }
        ])
      }
    }

    const errorRCWs = []
    errorRCWs.push([
      { v: 'Codigo RC con error', s: excelStyles.headerYellowStyle }
    ])

    errorRc.forEach(element => {
      errorRCWs.push([
        { v: element, s: excelStyles.whiteStyle }
      ])
    })

    const workbook = XLSX.utils.book_new()

    data.map(element => {
      const sellerName = []
      const splitChain = element.vendedor.split(' ')
      sellerName.push(`${splitChain[0]} ${splitChain[1]} ${splitChain[2]} ${splitChain[3]}`)
      return sellerName
    })

    sellerName.forEach(seller => {
      if (sellerWsData[seller]) {
        const sheetName = seller.split(' ')
        const worksheet = XLSX.utils.aoa_to_sheet(sellerWsData[seller])

        XLSX.utils.book_append_sheet(workbook, worksheet, `INCENTIVO ${sheetName[0]} ${sheetName[1]}`)

        XLSX.utils.sheet_add_aoa(worksheet, salesDetailTableHeaders, { origin: 'A17' })
        XLSX.utils.sheet_add_aoa(worksheet, sellerWsDataSale[seller], { origin: 'A19' })

        XLSX.utils.sheet_add_aoa(worksheet, collectionDetailTableHeaders, { origin: 'E17' })
        XLSX.utils.sheet_add_aoa(worksheet, sellerWsDataCollection[seller], { origin: 'E19' })

        worksheet['!cols'] = []
        const headerColumnSize = 20

        worksheet['!cols'][0] = { wch: headerColumnSize }
        worksheet['!cols'][1] = { wch: 40 }
        worksheet['!cols'][2] = { wch: 25 }
        worksheet['!cols'][3] = { wch: 15 }
        worksheet['!cols'][4] = { wch: 35 }
        worksheet['!cols'][5] = { wch: 28 }
        worksheet['!cols'][6] = { wch: 40 }
        worksheet['!cols'][7] = { wch: 25 }
      }
    })

    const excelFileName = `Informe Detalle de Ventas y Recaudo ${dateExcel.dia} ${dateExcel.mes}.xlsx`
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <div>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-solid fa-file-invoice' /> {title}</button>
    </div>
  )
}

export default ButtonDownloadDetailSaleAndCollection
