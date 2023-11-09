import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../styles/excelStyles'
import { DataContext } from './context/data'

const ButtonDownloadIncentivePayout = ({ title, data, convertExcelDateToReadable }) => {
  const { dateExcel, errorRc, dataCollection } = useContext(DataContext)

  const excelPercentageFormat = (percentageValue) => {
    const percentage = parseFloat(percentageValue / 100)
    return percentage
  }

  const handleDownload = () => {
    const values = ['Vendedor', 'Facturas', 'Meta de Venta', 'Venta (Sin flete)', '% Venta', 'Meta de Recaudo', 'Recaudo', '% Recaudo']
    const wsData = []

    values.forEach(value => {
      let row = [value]
      const cellValue = { v: '' }
      if (value === 'Vendedor') {
        cellValue.v = value
      }
      row = [cellValue]
      data.forEach(element => {
        const cellElement = { v: '' }
        if (value === 'Vendedor') {
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

    sellerName.forEach(seller => {
      if (seller !== 'Vendedor') {
        sellerData[seller] = []
        sellerWsData[seller] = []

        sellerDataSale[seller] = []
        sellerWsDataSale[seller] = []

        sellerDataCollection[seller] = []
        sellerWsDataCollection[seller] = []
      }
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
        values.forEach(value => {
          let row = [value]
          const cellValue = { v: '', s: {} }
          if (value === 'Vendedor') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Facturas') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Meta de Venta') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Venta (Sin flete)') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === '% Venta') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Meta de Recaudo') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Recaudo') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === '% Recaudo') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {}, t: '' }
            if (value === 'Vendedor') {
              cellElement.v = element.vendedor
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === 'Facturas') {
              cellElement.v = element.cantidadFacturas
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === 'Meta de Venta') {
              cellElement.v = element.metaVentas
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (value === 'Venta (Sin flete)') {
              cellElement.v = element.totalVenta
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (value === '% Venta') {
              cellElement.v = excelPercentageFormat(element.porcentajeVentas)
              cellElement.t = 'n'
              cellElement.s = excelStyles.percentageGrayStyle
            }
            if (value === 'Meta de Recaudo') {
              cellElement.v = element.metaRecaudoSinIva
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (value === 'Recaudo') {
              cellElement.v = element.totalRecaudo
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (value === '% Recaudo') {
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
    const salesDetailHeaderTable = []
    salesDetailHeaderTable.push([
      { v: 'Detalle Ventas', s: excelStyles.headerYellowStyle }
    ])
    salesDetailHeaderTable.push([
      { v: 'Fecha', s: excelStyles.headerYellowStyle },
      { v: 'Nombre Cliente', s: excelStyles.headerYellowStyle },
      { v: 'Ventas', s: excelStyles.headerYellowStyle }
    ])

    for (const key in data) {
      const seller = data[key].vendedor
      const customer = []
      const dateSalesPerCustomer = {}

      if (sellerWsDataSale[seller]) {
        customer[seller] = []
        sellerDataSale[seller].forEach(element => {
          const date = element.fecha
          const customer = element.cliente

          if (!dateSalesPerCustomer[date]) {
            dateSalesPerCustomer[date] = {}
          }
          if (!dateSalesPerCustomer[date][customer]) {
            dateSalesPerCustomer[date][customer] = 0
          }

          dateSalesPerCustomer[date][customer] += element.ventas
        })
      }

      for (const key in customer) {
        const seller = key
        let total = 0
        for (const key in dateSalesPerCustomer) {
          if (sellerWsDataSale[seller]) {
            const date = key
            for (const item in dateSalesPerCustomer[key]) {
              const customer = item
              const totalSales = dateSalesPerCustomer[key][item]
              total += totalSales
              sellerWsDataSale[seller].push([
                { v: convertExcelDateToReadable(date), s: excelStyles.whiteStyle },
                { v: customer, s: excelStyles.whiteStyle },
                { v: totalSales, s: excelStyles.yellowStyleCurrencyFormat, t: 'n' }
              ])
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
    const collectionDetailHeaderTable = []
    collectionDetailHeaderTable.push([
      { v: '', s: {} },
      { v: 'Detalle Archivo Gestion De Cobranza', s: excelStyles.headerYellowStyle }
    ])
    collectionDetailHeaderTable.push([
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

    const incentiveWsData = []
    const salesBonus = ['Venta']
    const collectionBonus = ['Recaudo']
    const resultBonus = ['Bono resultados']
    const commission = ['Total comision']

    sellerName.forEach(seller => {
      if (seller !== 'Vendedor') {
        sellerData[seller] = []
        incentiveWsData[seller] = []
      }
    })

    for (const key in data) {
      const seller = data[key].vendedor
      if (sellerData[seller]) {
        sellerData[seller].push(data[key])
      }
    }

    for (const key in data) {
      const seller = data[key].vendedor
      if (incentiveWsData[seller]) {
        salesBonus.forEach(bonus => {
          let row = [bonus]
          const cellValue = { v: '', s: {} }
          if (bonus === 'Venta') {
            cellValue.v = bonus
            cellValue.s = excelStyles.headerYellowStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {}, t: '' }
            if (bonus === 'Venta') {
              cellElement.v = element.comisionVenta
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            row.push({ v: '>=100%', s: excelStyles.whiteStyle }, { v: '1% Venta', s: excelStyles.whiteStyle })
            row.push(cellElement)
          })
          incentiveWsData[seller].push(row)
        })
      }
    }
    for (const key in data) {
      const seller = data[key].vendedor
      if (incentiveWsData[seller]) {
        collectionBonus.forEach(bonus => {
          let row = [bonus]
          const cellValue = { v: '', s: {} }
          if (bonus === 'Recaudo') {
            cellValue.v = bonus
            cellValue.s = excelStyles.headerYellowStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {} }
            if (bonus === 'Recaudo') {
              cellElement.v = element.comisionRecaudo
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            row.push({ v: '>=100%', s: excelStyles.whiteStyle }, { v: '1% Recaudo', s: excelStyles.whiteStyle })
            row.push(cellElement)
          })
          incentiveWsData[seller].push(row)
          incentiveWsData[seller].push([{ v: '', s: {} }])
        })
      }
    }
    for (const key in data) {
      const seller = data[key].vendedor
      if (incentiveWsData[seller]) {
        commission.forEach(bonus => {
          let row = [bonus]
          const cellValue = { v: '', s: {} }
          if (bonus === 'Total comision') {
            cellValue.v = bonus
            cellValue.s = excelStyles.headerGreenStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {} }
            if (bonus === 'Total comision') {
              cellElement.v = element.comisionTotal
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            row.push({ v: '', s: excelStyles.whiteStyle }, { v: '', s: excelStyles.whiteStyle })
            row.push(cellElement)
          })
          incentiveWsData[seller].push(row)
          incentiveWsData[seller].push([{ v: '', s: {} }])
        })
      }
    }
    for (const key in data) {
      const seller = data[key].vendedor

      // Bonos
      const firstBonus = sellerData[seller].map(el => el.totalRecaudo * 0.02)

      let secondBonus = 0
      sellerData[seller].forEach(el => {
        if (el.porcentajeVentas > 100 && el.porcentajeRecaudo > 100) {
          secondBonus = el.totalRecaudo * 0.012
        } else {
          secondBonus = 0
        }
      })

      // TODO: Trabajar las funcionalidades de los siguientes bonos
      const thirdBonus = 0
      sellerData[seller].forEach(el => {
        // el.totalRecaudo * 0.06
      })
      const fourthBonus = 0
      sellerData[seller].forEach(el => {
        // el => el.totalRecaudo * 0.07
      })
      let fifthBonus = 0
      sellerData[seller].forEach(el => {
        if (el.clientesNuevos > 0) {
          fifthBonus = (el.totalRecaudo * 0.001) * el.clientesNuevos
        }
      })

      if (incentiveWsData[seller]) {
        resultBonus.forEach(bonus => {
          let row = [bonus]
          const cellValue = { v: '', s: {}, t: '' }
          if (bonus === 'Bono resultados') {
            cellValue.v = bonus
            cellValue.s = excelStyles.headerYellowStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {} }
            if (bonus === 'Bono resultados') {
              cellElement.v = element.bonoResultado
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            row.push({ v: '', s: excelStyles.whiteStyle }, { v: '', s: excelStyles.whiteStyle })
            row.push(cellElement)
          })
          incentiveWsData[seller].push(row)
          incentiveWsData[seller].push(
            [
              { v: '', s: {} }
            ],
            [
              { v: 'Bono Resultados', s: excelStyles.headerYellowStyle },
              { v: '2% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Sin condiciones', s: excelStyles.whiteStyle },
              { v: `${firstBonus}`, s: excelStyles.whiteStyleCurrencyFormat, t: 'n' }
            ],
            [
              { v: '', s: {} },
              { v: '1,2% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Recaudo > 100% + Venta >100%', s: excelStyles.whiteStyle },
              { v: `${secondBonus}`, s: excelStyles.whiteStyleCurrencyFormat, t: 'n' }
            ],
            [
              { v: '', s: {} },
              { v: '0,6% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Util ml del mes >10% al 20% *para los que cumplen recaudo*', s: excelStyles.whiteStyle },
              { v: `${thirdBonus}`, s: excelStyles.whiteStyleCurrencyFormat, t: 'n' }
            ],
            [
              { v: '', s: {} },
              { v: '0,7% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Util ml del mes >20%', s: excelStyles.whiteStyle },
              { v: `${fourthBonus}`, s: excelStyles.whiteStyleCurrencyFormat, t: 'n' }
            ],
            [{ v: '', s: {} },
              { v: '0,1% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Por cada cliente nuevo', s: excelStyles.whiteStyle },
              { v: `${fifthBonus}`, s: excelStyles.whiteStyleCurrencyFormat, t: 'n' }
            ]
          )
          incentiveWsData[seller].push([{ v: '', s: {} }])
        })
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
        XLSX.utils.sheet_add_aoa(worksheet, incentiveWsData[seller], { origin: 'D2' })

        XLSX.utils.sheet_add_aoa(worksheet, salesDetailHeaderTable, { origin: 'A17' })
        XLSX.utils.sheet_add_aoa(worksheet, sellerWsDataSale[seller], { origin: 'A19' })

        XLSX.utils.sheet_add_aoa(worksheet, collectionDetailHeaderTable, { origin: 'E17' })
        XLSX.utils.sheet_add_aoa(worksheet, sellerWsDataCollection[seller], { origin: 'E19' })

        worksheet['!cols'] = []

        worksheet['!cols'][0] = { wch: 20 }
        worksheet['!cols'][1] = { wch: 40 }
        worksheet['!cols'][2] = { wch: 25 }
        worksheet['!cols'][3] = { wch: 15 }
        worksheet['!cols'][4] = { wch: 20 }
        worksheet['!cols'][5] = { wch: 35 }
        worksheet['!cols'][6] = { wch: 40 }
        worksheet['!cols'][7] = { wch: 25 }

        XLSX.utils.book_append_sheet(workbook, worksheet, `INCENTIVO ${sheetName[0]} ${sheetName[1]}`)
      }
    })

    const errorWs = XLSX.utils.aoa_to_sheet(errorRCWs)
    errorWs['!cols'] = []
    errorWs['!cols'][0] = { wch: 25 }

    XLSX.utils.book_append_sheet(workbook, errorWs, 'ERROR RC')

    const excelFileName = `Informe Liq Incentivos ${dateExcel.dia} ${dateExcel.mes}.xlsx`
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-solid fa-file-invoice-dollar' /> {title}</button>
    </>
  )
}

export default ButtonDownloadIncentivePayout
