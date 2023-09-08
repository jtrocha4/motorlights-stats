import React from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../styles/excelStyles'

const ButtonDownloadIncentivePayout = ({ title, data, currencyFormat, dataCollection, formatDate, toFixed }) => {
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
              cellElement.v = currencyFormat(element.metaVentas)
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === 'Venta (Sin flete)') {
              cellElement.v = currencyFormat(element.totalVenta)
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === '% Venta') {
              cellElement.v = excelPercentageFormat(element.porcentajeVentas)
              cellElement.t = 'n'
              cellElement.s = excelStyles.percentageGrayStyle
            }
            if (value === 'Meta de Recaudo') {
              cellElement.v = currencyFormat(element.metaRecaudoSinIva)
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === 'Recaudo') {
              cellElement.v = currencyFormat(element.totalRecaudo)
              cellElement.s = excelStyles.whiteStyle
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
      const totalSalesPerCustomer = []
      const dateSalesPerCustomer = []

      if (sellerWsDataSale[seller]) {
        customer[seller] = []
        sellerDataSale[seller].forEach(element => {
          if (totalSalesPerCustomer[element.Nombres]) {
            totalSalesPerCustomer[element.Nombres] += element.Ventas
            dateSalesPerCustomer[element.Nombres] = element.Fecha
          } else {
            totalSalesPerCustomer[element.Nombres] = element.Ventas
            dateSalesPerCustomer[element.Nombres] = element.Fecha
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
                  { v: formatDate(date), s: excelStyles.whiteStyle },
                  { v: key, s: excelStyles.whiteStyle },
                  { v: currencyFormat(totalSales), s: excelStyles.yellowStyle }
                ])
              }
            }
          }
        }
        sellerWsDataSale[seller].push([
          { v: 'Total', s: excelStyles.headerBlackStyle },
          { v: '', s: excelStyles.headerBlackStyle },
          { v: currencyFormat(total), s: excelStyles.blackStyle }
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
      if (sellerWsDataCollection[seller]) {
        sellerWsDataCollection[seller] = sellerDataCollection[seller].map(element => ([
          { v: formatDate(element.Fecha_), s: excelStyles.whiteStyle },
          { v: element.Factura, s: excelStyles.whiteStyle },
          { v: element.Cliente, s: excelStyles.whiteStyle },
          { v: element.Recaudo, s: excelStyles.whiteStyle }
        ]))
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
            const cellElement = { v: '', s: {} }
            if (bonus === 'Venta') {
              cellElement.v = currencyFormat(element.comisionVenta)
              cellElement.s = excelStyles.whiteStyle
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
              cellElement.v = currencyFormat(element.comisionRecaudo)
              cellElement.s = excelStyles.whiteStyle
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
              cellElement.v = currencyFormat(element.comisionTotal)
              cellElement.s = excelStyles.whiteStyle
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
      const fifthBonus = 0

      if (incentiveWsData[seller]) {
        resultBonus.forEach(bonus => {
          let row = [bonus]
          const cellValue = { v: '', s: {} }
          if (bonus === 'Bono resultados') {
            cellValue.v = bonus
            cellValue.s = excelStyles.headerYellowStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {} }
            if (bonus === 'Bono resultados') {
              cellElement.v = currencyFormat(element.bonoResultado)
              cellElement.s = excelStyles.whiteStyle
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
              { v: `${currencyFormat(firstBonus)}`, s: excelStyles.whiteStyle }
            ],
            [
              { v: '', s: {} },
              { v: '1,2% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Recaudo > 100% + Venta >100%', s: excelStyles.whiteStyle },
              { v: `${currencyFormat(secondBonus)}`, s: excelStyles.whiteStyle }
            ],
            [
              { v: '', s: {} },
              { v: '0,6% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Util ml del mes >10% al 20% *para los que cumplen recaudo*', s: excelStyles.whiteStyle },
              { v: `${currencyFormat(thirdBonus)}`, s: excelStyles.whiteStyle }
            ],
            [
              { v: '', s: {} },
              { v: '0,7% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Util ml del mes >20%', s: excelStyles.whiteStyle },
              { v: `${currencyFormat(fourthBonus)}`, s: excelStyles.whiteStyle }
            ],
            [{ v: '', s: {} },
              { v: '0,1% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Por cada cliente nuevo', s: excelStyles.whiteStyle },
              { v: `${currencyFormat(fifthBonus)}`, s: excelStyles.whiteStyle }
            ]
          )
          incentiveWsData[seller].push([{ v: '', s: {} }])
        })
      }
    }

    const workbook = XLSX.utils.book_new()

    data.map(element => {
      const sellerName = []
      const splitChain = element.vendedor.split(' ')
      sellerName.push(`${splitChain[0]} ${splitChain[1]} ${splitChain[2]} ${splitChain[3]}`)
      return sellerName
    })

    const columnWidths = wsData.reduce((acc, row) => {
      row.forEach((cell, colIndex) => {
        const cellValue = cell.v ? cell.toString() : ''
        acc[colIndex] = Math.max(acc[colIndex] || 0, cellValue.length)
      })
      return acc
    }, [])

    sellerName.forEach(seller => {
      if (sellerWsData[seller]) {
        const sheetName = seller.split(' ')
        const ws = XLSX.utils.aoa_to_sheet(sellerWsData[seller])
        XLSX.utils.sheet_add_aoa(ws, incentiveWsData[seller], { origin: 'D2' })

        XLSX.utils.sheet_add_aoa(ws, salesDetailHeaderTable, { origin: 'A17' })
        XLSX.utils.sheet_add_aoa(ws, sellerWsDataSale[seller], { origin: 'A19' })

        XLSX.utils.sheet_add_aoa(ws, collectionDetailHeaderTable, { origin: 'E17' })
        XLSX.utils.sheet_add_aoa(ws, sellerWsDataCollection[seller], { origin: 'E19' })

        ws['!cols'] = columnWidths.map(width => ({ wch: width + 5 }))
        XLSX.utils.book_append_sheet(workbook, ws, `INCENTIVO ${sheetName[0]} ${sheetName[1]}`)
      }
    })

    const excelFileName = 'Liq Incentivos.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <div>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </div>
  )
}

export default ButtonDownloadIncentivePayout
