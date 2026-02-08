import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../../styles/excelStyles'
import { DataContext } from '../../context/data'
import { DataExcelContext } from '../../context/dataExcel'

const ButtonDownloadIncentivePayout = ({ title, data, convertExcelDateToReadable }) => {
  const { errorRc, dataCollection } = useContext(DataContext)
  const { dateExcel } = useContext(DataExcelContext)

  const excelPercentageFormat = (percentageValue) => {
    const percentage = parseFloat(percentageValue / 100)
    return percentage
  }

  const handleDownload = () => {
    const values = ['Vendedor', 'Facturas', 'Meta de Venta', 'Venta (Sin flete)', '% Venta', 'Meta de Recaudo', 'Recaudo', '% Recaudo', 'Meta de clientes', 'Clientes atendidos', '% Clientes', 'Clientes nuevos con ventas', 'Meta portafolio', 'Venta portafolio', '% Venta portafolio']
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

    const sellerDataPortfolioSales = {}
    const sellerWsDataPortfolioSales = {}

    sellerName.forEach(seller => {
      if (seller !== 'Vendedor') {
        sellerData[seller] = []
        sellerWsData[seller] = []

        sellerDataSale[seller] = []
        sellerWsDataSale[seller] = []

        sellerDataCollection[seller] = []
        sellerWsDataCollection[seller] = []

        sellerDataPortfolioSales[seller] = []
        sellerWsDataPortfolioSales[seller] = []
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
      const portfolioSales = data[key].ventasDelPortafolio

      if (sellerDataPortfolioSales[seller]) {
        for (const productId in portfolioSales) {
          sellerDataPortfolioSales[seller].push(portfolioSales[productId])
        }
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
            cellValue.s = excelStyles.headerGrayStyle
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
            cellValue.s = excelStyles.headerGrayStyle
          }
          if (value === 'Meta de clientes') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Clientes atendidos') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === '% Clientes') {
            cellValue.v = value
            cellValue.s = excelStyles.headerGrayStyle
          }
          if (value === 'Clientes nuevos con ventas') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Meta portafolio') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Venta portafolio') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === '% Venta portafolio') {
            cellValue.v = value
            cellValue.s = excelStyles.headerGrayStyle
          }

          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {}, t: '' }
            if (value === 'Vendedor') {
              cellElement.v = element.vendedor
              cellElement.s = excelStyles.whiteStyleTextFormat
            }
            if (value === 'Facturas') {
              cellElement.v = element.cantidadFacturas
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleNumberFormat
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
            if (value === 'Meta de clientes') {
              cellElement.v = element.metaClientesDePortafolio
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleNumberFormat
            }
            if (value === 'Clientes atendidos') {
              cellElement.v = element.totalClientesAtendidosDelPortafolio
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleNumberFormat
            }
            if (value === '% Clientes') {
              cellElement.v = excelPercentageFormat(element.porcentajeClientesAtendidosDelPortafolio)
              cellElement.t = 'n'
              cellElement.s = excelStyles.percentageGrayStyle
            }
            if (value === 'Clientes nuevos con ventas') {
              cellElement.v = element.clientesNuevosConVentas
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleNumberFormat
            }
            if (value === 'Meta portafolio') {
              cellElement.v = element.metaPortafolio
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (value === 'Venta portafolio') {
              cellElement.v = element.totalVentasPortafolio
              cellElement.t = 'n'
              cellElement.s = excelStyles.whiteStyleCurrencyFormat
            }
            if (value === '% Venta portafolio') {
              cellElement.v = excelPercentageFormat(element.porcentajeVentasPortafolio)
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
      { v: 'Factura', s: excelStyles.headerYellowStyle },
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
          const factura = element.doc

          if (!dateSalesPerCustomer[date]) {
            dateSalesPerCustomer[date] = {}
          }
          if (!dateSalesPerCustomer[date][customer]) {
            dateSalesPerCustomer[date][customer] = {}
          }
          if (!dateSalesPerCustomer[date][customer][factura]) {
            dateSalesPerCustomer[date][customer][factura] = 0
          }

          dateSalesPerCustomer[date][customer][factura] += element.ventas
        })
      }

      for (const key in customer) {
        const seller = key
        let total = 0

        for (const date in dateSalesPerCustomer) {
          if (sellerWsDataSale[seller]) {
            for (const customer in dateSalesPerCustomer[date]) {
              for (const factura in dateSalesPerCustomer[date][customer]) {
                const totalSales = dateSalesPerCustomer[date][customer][factura]
                total += totalSales
                sellerWsDataSale[seller].push([
                  { v: convertExcelDateToReadable(date), s: excelStyles.whiteRowStyleNumberFormat },
                  { v: customer, s: excelStyles.whiteRowStyleTextFormat },
                  { v: factura, s: excelStyles.whiteRowStyleTextFormat },
                  { v: totalSales, s: excelStyles.yellowStyleCurrencyFormat, t: 'n' }
                ])
              }
            }
          }
        }

        sellerWsDataSale[seller].push([
          { v: 'Total', s: excelStyles.headerBlackStyle },
          { v: '', s: excelStyles.headerBlackStyle },
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
            { v: convertExcelDateToReadable(element.fecha), s: excelStyles.whiteRowStyleNumberFormat },
            { v: element.factura, s: excelStyles.whiteRowStyleTextFormat },
            { v: element.cliente, s: excelStyles.whiteRowStyleTextFormat },
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

    // Tabla detalle de ventas del portafolio
    const salesDetailsOfThePortfolioHeaderTable = []
    salesDetailsOfThePortfolioHeaderTable.push([
      { v: 'Detalle Ventas Del Portafolio ', s: excelStyles.headerYellowStyle }
    ])
    salesDetailsOfThePortfolioHeaderTable.push([
      { v: 'Producto', s: excelStyles.headerYellowStyle },
      { v: 'Valor', s: excelStyles.headerYellowStyle }
    ])

    for (const key in data) {
      const seller = data[key].vendedor

      let total = 0

      if (sellerWsDataPortfolioSales[seller]) {
        sellerDataPortfolioSales[seller].forEach(({ producto, codigo, totalDeVenta }) => {
          total += totalDeVenta
          sellerWsDataPortfolioSales[seller].push([
            { v: codigo + '-' + producto, s: excelStyles.whiteRowStyleTextFormat },
            { v: totalDeVenta, s: excelStyles.whiteStyleCurrencyFormat, t: 'n' }
          ])
        })
        sellerWsDataPortfolioSales[seller].push([
          { v: 'Total', s: excelStyles.headerBlackStyle },
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
            row.push({ v: '>=100%', s: excelStyles.whiteStyleTextFormat }, { v: '1% Venta', s: excelStyles.whiteStyleTextFormat })
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
            row.push({ v: '>=100%', s: excelStyles.whiteStyleTextFormat }, { v: '1% Recaudo', s: excelStyles.whiteStyleTextFormat })
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
            row.push({ v: '', s: excelStyles.whiteStyleTextFormat }, { v: '', s: excelStyles.whiteStyleTextFormat })
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

      // * 1. gana el 1% del recaudo si cumple al 100% si cumple del 90 al 100% se gana el 0,6% del recaudo.

      let firstBonus = 0
      sellerData[seller].forEach(el => {
        if (el.porcentajeRecaudo >= 100) {
          firstBonus = el.totalRecaudo * 0.01
        }
        if (el.porcentajeRecaudo >= 90 && el.porcentajeRecaudo < 100) {
          firstBonus = el.totalRecaudo * 0.006
        }
      })

      // const firstBonus = sellerData[seller].map(el => el.totalRecaudo * 0.02)

      // * 2. gana el 1% del recaudo si cumple al 100% (la venta)  si cumple del 90 al 100% se gana el 0,6% del recaudo.  Ambos se pagan por el recaudo pero debo tener en cuenta si cumplió la venta

      let secondBonus = 0
      sellerData[seller].forEach(el => {
        if (el.porcentajeVentas >= 100) {
          secondBonus = el.totalRecaudo * 0.01
        }
        if (el.porcentajeRecaudo >= 90 && el.porcentajeRecaudo < 100) {
          secondBonus = el.totalRecaudo * 0.006
        }
      })

      /*
      sellerData[seller].forEach(el => {
        if (el.porcentajeVentas > 100 && el.porcentajeRecaudo > 100) {
          secondBonus = el.totalRecaudo * 0.012
        } else {
          secondBonus = 0
        }
      })
      */

      // * 3. se calcula meta de rotación con el 3% de la meta de venta,  debemos tener un campo donde podamos poner un listado de productos y que el software consulte este listado y revise si la venta de los productos cumplió la meta (ese 3% que se calculó)  en caso de cumplirlo se gana el 1% del recaudo

      let thirdBonus = 0
      sellerData[seller].forEach(el => {
        if (el.totalVentasPortafolio >= el.metaPortafolio) {
          thirdBonus = el.totalRecaudo * 0.01
        }
      })

      // * 4. meta para clientes de portafolio, si se cumple el 100% de la meta de clientes se gana el 1% del recaudo

      let fourthBonus = 0
      sellerData[seller].forEach(el => {
        if (el.porcentajeClientesAtendidosDelPortafolio >= 100) {
          fourthBonus = el.totalRecaudo * 0.01
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
            row.push({ v: '', s: excelStyles.whiteStyleTextFormat }, { v: '', s: excelStyles.whiteStyleTextFormat })
            row.push(cellElement)
          })
          incentiveWsData[seller].push(row)
          incentiveWsData[seller].push(
            [
              { v: '', s: {} }
            ],
            [
              { v: 'Bono Resultados', s: excelStyles.headerYellowStyle },
              { v: 'Bono adicional por recaudo', s: excelStyles.whiteStyleTextFormat },
              { v: 'Gana el 1% del recaudo cuando el cumplimiento del recaudo es del 100%. Si el cumplimiento se encuentra entre el 90% y un valor inferior al 100%, el incentivo corresponde al 0,6% del recaudo.', s: excelStyles.whiteStyleTextFormat },
              { v: `${firstBonus}`, s: excelStyles.whiteStyleCurrencyFormat, t: 'n' }
            ],
            [
              { v: '', s: {} },
              { v: 'Bono adicional por venta', s: excelStyles.whiteStyleTextFormat },
              { v: 'Gana el 1% del recaudo cuando el cumplimiento de la venta es del 100%. Si el cumplimiento de la venta se encuentra entre el 90% y un valor inferior al 100%, el incentivo corresponde al 0,6% del recaudo.', s: excelStyles.whiteStyleTextFormat },
              { v: `${secondBonus}`, s: excelStyles.whiteStyleCurrencyFormat, t: 'n' }
            ],
            [
              { v: '', s: {} },
              { v: 'Rotación de productos', s: excelStyles.whiteStyleTextFormat },
              { v: 'Gana el 1% del recaudo cuando el cumplimiento de la meta de rotación de inventario (3% de la meta de venta) es superada.', s: excelStyles.whiteStyleTextFormat },
              { v: `${thirdBonus}`, s: excelStyles.whiteStyleCurrencyFormat, t: 'n' }
            ],
            [
              { v: '', s: {} },
              { v: 'Impacto minimo de clientes del portafolio', s: excelStyles.whiteStyleTextFormat },
              { v: 'Gana el 1% del recaudo cuando el cumplimiento de clientes atendidos en el mes es del 100%', s: excelStyles.whiteStyleTextFormat },
              { v: `${fourthBonus}`, s: excelStyles.whiteStyleCurrencyFormat, t: 'n' }
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
        { v: element, s: excelStyles.whiteStyleTextFormat }
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

        // Tabla Detalle Ventas
        XLSX.utils.sheet_add_aoa(worksheet, salesDetailHeaderTable, { origin: 'A17' })
        XLSX.utils.sheet_add_aoa(worksheet, sellerWsDataSale[seller], { origin: 'A19' })

        // Tabla Detalle Gestion Cobranza
        XLSX.utils.sheet_add_aoa(worksheet, collectionDetailHeaderTable, { origin: 'F17' })
        XLSX.utils.sheet_add_aoa(worksheet, sellerWsDataCollection[seller], { origin: 'F19' })

        // Tabla detalle de ventas del portafolio
        XLSX.utils.sheet_add_aoa(worksheet, salesDetailsOfThePortfolioHeaderTable, { origin: 'K17' })
        XLSX.utils.sheet_add_aoa(worksheet, sellerWsDataPortfolioSales[seller], { origin: 'K19' })

        worksheet['!cols'] = []

        worksheet['!cols'][0] = { wch: 35 }
        worksheet['!cols'][1] = { wch: 40 }
        worksheet['!cols'][2] = { wch: 25 }
        worksheet['!cols'][3] = { wch: 25 }
        worksheet['!cols'][4] = { wch: 35 }
        worksheet['!cols'][5] = { wch: 30 }
        worksheet['!cols'][6] = { wch: 40 }
        worksheet['!cols'][7] = { wch: 40 }
        worksheet['!cols'][8] = { wch: 25 }
        worksheet['!cols'][10] = { wch: 45 }
        worksheet['!cols'][11] = { wch: 25 }

        const numberOfCharacters = sheetName[0].length + sheetName[1].length

        if (numberOfCharacters > 22) {
          XLSX.utils.book_append_sheet(workbook, worksheet, `INCENTIVO ${sheetName[0]}`)
        } else {
          XLSX.utils.book_append_sheet(workbook, worksheet, `INCENTIVO ${sheetName[0]} ${sheetName[1]}`)
        }
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
