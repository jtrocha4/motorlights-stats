import React from 'react'
import XLSX from 'xlsx-js-style'
import _ from 'lodash'
import excelStyles from '../styles/excelStyles'

const ButtonDownloadExcel = ({ title, data, currencyFormat, toFixed, dateExcel }) => {
  const commaPercentageFormat = (percentageValue) => {
    let percentage = parseFloat(percentageValue / 100)
    percentage = toFixed(percentage, 3)
    const percentageString = percentage.toString()
    const percentajeCommaFormat = percentageString.replace(/\./g, ',')
    return percentajeCommaFormat
  }

  const handleDownload = () => {
    const dates = ['Mes']
    const headers = ['Vendedor']
    const values = ['Total ventas', 'Cantidad de facturas', 'Promedio de ventas', 'Meta ventas', '% Venta', 'Ventas pendiente', 'Total recaudo', 'Meta recaudo sin iva', '% Recaudo', 'Recaudo pendiente']

    const wsData = []
    const wsDataPercentaje = []

    dates.forEach(date => {
      const cell = { v: '', s: {} }
      let row = [date]
      if (date === 'Mes') {
        cell.v = `${dateExcel.mes}`
        cell.s = excelStyles.headerYellowStyle
      }
      row = [cell]
      wsData.push(row)
    })

    headers.forEach(header => {
      const cell = { v: '', s: {} }
      let row = [header]
      if (header === 'Vendedor') {
        cell.v = commaPercentageFormat(dateExcel.porcentajeDiasTranscurridos)
        cell.s = excelStyles.percentageYellowStyle
      }
      row = [cell]
      data.forEach(element => {
        const splitName = element.vendedor.split(' ')
        const firstAndMiddleName = `${splitName[0]} ${splitName[1]}`
        const cell = { v: '', s: {} }
        if (header === 'Vendedor') {
          cell.v = firstAndMiddleName
          cell.s = excelStyles.headerBlackStyle
        }
        row.push(cell)
      })
      wsData.push([...row, {
        v: 'Total',
        s: excelStyles.headerBlackStyle
      }])
    })

    values.forEach(value => {
      let row = [value]
      const cellValue = { v: '', s: {} }
      if (value === 'Total ventas') {
        cellValue.v = value
        cellValue.s = excelStyles.headerYellowStyle
      }
      if (value === 'Cantidad de facturas') {
        cellValue.v = value
        cellValue.s = excelStyles.headerGrayStyle
      }
      if (value === 'Promedio de ventas') {
        cellValue.v = value
        cellValue.s = excelStyles.headerGrayStyle
      }
      if (value === 'Meta ventas') {
        cellValue.v = value
        cellValue.s = excelStyles.headerBlackStyle
      }
      if (value === '% Venta') {
        cellValue.v = value
        cellValue.s = excelStyles.headerWhiteStyle
      }
      if (value === '% Venta') {
        cellValue.v = value
        cellValue.s = excelStyles.headerWhiteStyle
      }
      if (value === 'Ventas pendiente') {
        cellValue.v = value
        cellValue.s = excelStyles.headerWhiteStyle
      }
      if (value === 'Total recaudo') {
        cellValue.v = value
        cellValue.s = excelStyles.headerYellowStyle
      }
      if (value === 'Meta recaudo sin iva') {
        cellValue.v = value
        cellValue.s = excelStyles.headerBlackStyle
      }
      if (value === '% Recaudo') {
        cellValue.v = value
        cellValue.s = excelStyles.headerWhiteStyle
      }
      if (value === 'Recaudo pendiente') {
        cellValue.v = value
        cellValue.s = excelStyles.headerWhiteStyle
      }
      row = [cellValue]
      data.forEach(item => {
        const cell = { v: '', s: {} }
        if (value === 'Total ventas') {
          cell.v = currencyFormat(item.totalVenta)
          cell.s = excelStyles.yellowStyle
        }
        if (value === 'Cantidad de facturas') {
          cell.v = item.cantidadFacturas
          cell.s = excelStyles.grayStyle
        }
        if (value === 'Promedio de ventas') {
          cell.v = currencyFormat(item.promedioVentas)
          cell.s = excelStyles.grayStyle
        }
        if (value === 'Meta ventas') {
          cell.v = currencyFormat(item.metaVentas)
          cell.s = excelStyles.blackStyle
        }
        if (value === '% Venta') {
          cell.v = commaPercentageFormat(item.porcentajeVentas)
          cell.s = excelStyles.whiteStyle
        }
        if (value === 'Ventas pendiente') {
          cell.v = currencyFormat(item.ventasPendiente)
          cell.s = excelStyles.whiteStyle
        }
        if (value === 'Total recaudo') {
          cell.v = currencyFormat(item.totalRecaudo)
          cell.s = excelStyles.yellowStyle
        }
        if (value === 'Meta recaudo sin iva') {
          cell.v = currencyFormat(item.metaRecaudoSinIva)
          cell.s = excelStyles.blackStyle
        }
        if (value === '% Recaudo') {
          cell.v = commaPercentageFormat(item.porcentajeRecaudo)
          cell.s = excelStyles.whiteStyle
        }
        if (value === 'Recaudo pendiente') {
          cell.v = currencyFormat(item.recaudoPendiente)
          cell.s = excelStyles.whiteStyle
        }
        row.push(cell)
      })

      const total = {
        ventas: 0,
        facturas: 0,
        promedioVentas: 0,
        metaVentas: 0,
        porcentajeVentas: 0,
        ventasPendiente: 0,
        recaudo: 0,
        metaRecaudoSinIva: 0,
        porcentajeRecaudo: 0,
        recaudoPendiente: 0
      }

      // Operaciones para calcular el total
      total.ventas = data.reduce((acc, item) => acc + item.totalVenta, 0)
      total.facturas = data.reduce((acc, item) => acc + item.cantidadFacturas, 0)
      total.promedioVentas = total.ventas / total.facturas
      total.metaVentas = data.reduce((acc, item) => acc + item.metaVentas, 0)
      total.ventasPendiente = data.reduce((acc, item) => acc + item.ventasPendiente, 0)
      total.porcentajeVentas = 100 - (total.ventasPendiente * 100) / total.metaVentas

      total.recaudo = data.reduce((acc, item) => acc + item.totalRecaudo, 0)
      total.metaRecaudoSinIva = data.reduce((acc, item) => acc + item.metaRecaudoSinIva, 0)
      total.porcentajeRecaudo = (total.recaudo * 100) / total.metaRecaudoSinIva
      total.recaudoPendiente = data.reduce((acc, item) => acc + item.recaudoPendiente, 0)

      // Aproximaciones
      total.porcentajeVentas = toFixed(total.porcentajeVentas, 1)
      total.porcentajeRecaudo = toFixed(total.porcentajeRecaudo, 1)

      const cell = { v: '', s: {} }
      if (value === 'Total ventas') {
        cell.v = currencyFormat(total.ventas)
        cell.s = excelStyles.yellowStyle
        row.push(cell)
      }
      if (value === 'Cantidad de facturas') {
        cell.v = total.facturas
        cell.s = excelStyles.grayStyle
        row.push(cell)
      }
      if (value === 'Promedio de ventas') {
        cell.v = currencyFormat(total.promedioVentas)
        cell.s = excelStyles.grayStyle
        row.push(cell)
      }
      if (value === 'Meta ventas') {
        cell.v = currencyFormat(total.metaVentas)
        cell.s = excelStyles.blackStyle
        row.push(cell)
      }
      if (value === '% Venta') {
        cell.v = commaPercentageFormat(total.porcentajeVentas)
        cell.s = excelStyles.whiteStyle
        row.push(cell)
      }
      if (value === 'Ventas pendiente') {
        cell.v = currencyFormat(total.ventasPendiente)
        cell.s = excelStyles.whiteStyle
        row.push(cell)
      }
      if (value === 'Total recaudo') {
        cell.v = currencyFormat(total.recaudo)
        cell.s = excelStyles.yellowStyle
        row.push(cell)
      }
      if (value === 'Meta recaudo sin iva') {
        cell.v = currencyFormat(total.metaRecaudoSinIva)
        cell.s = excelStyles.blackStyle
        row.push(cell)
      }
      if (value === '% Recaudo') {
        cell.v = commaPercentageFormat(total.porcentajeRecaudo)
        cell.s = excelStyles.whiteStyle
        row.push(cell)
      }
      if (value === 'Recaudo pendiente') {
        cell.v = currencyFormat(total.recaudoPendiente)
        cell.s = excelStyles.whiteStyle
        row.push(cell)
      }
      wsData.push(row)
    })

    console.log(wsData)

    const wsDateData = []
    const workDays = []
    const daysElapsed = []
    const PercentageDaysElapsed = []
    workDays.push({
      v: 'Dias habiles del mes',
      s: excelStyles.headerWhiteStyle
    }, {
      v: dateExcel.diasLaborales,
      s: excelStyles.whiteStyle
    }, {
      v: `Desde ${dateExcel.fechaInicial} hasta ${dateExcel.fechaFinal}`,
      s: excelStyles.whiteStyle
    })
    daysElapsed.push({
      v: 'Dias transcurridos',
      s: excelStyles.headerWhiteStyle
    }, {
      v: dateExcel.diasTranscurridos,
      s: excelStyles.whiteStyle
    })
    PercentageDaysElapsed.push({
      v: '',
      s: {}
    }, {
      v: commaPercentageFormat(dateExcel.porcentajeDiasTranscurridos),
      s: excelStyles.percentageGrayStyle
    })
    wsDateData.push(workDays)
    wsDateData.push(daysElapsed)
    wsDateData.push(PercentageDaysElapsed)

    const newDataHeaderStyle = {}
    newDataHeaderStyle.v = 'Avance del Mes'
    newDataHeaderStyle.s = excelStyles.headerYellowStyle

    const newWsData = []
    newWsData.push(newDataHeaderStyle)
    newWsData.push({
      v: commaPercentageFormat(dateExcel.porcentajeDiasTranscurridos),
      s: excelStyles.percentageYellowStyle
    })

    wsDataPercentaje.push(newWsData)
    const wsSellerData = _.cloneDeep(wsData[1])
    wsSellerData[0].v = 'Vendedores'
    wsSellerData[0].s = excelStyles.headerBlackStyle
    wsDataPercentaje.push(wsSellerData)
    wsDataPercentaje.push(wsData[6])
    wsDataPercentaje.push(wsData[10])

    const workbook = XLSX.utils.book_new()
    const sheetName = 'Resumen'

    const ws = XLSX.utils.aoa_to_sheet(wsData, { origin: 'A2' })
    XLSX.utils.sheet_add_aoa(ws, wsDateData, { origin: 'A17' })
    XLSX.utils.sheet_add_aoa(ws, wsDataPercentaje, { origin: 'A22' })

    const columnWidths = wsData.reduce((acc, row) => {
      row.forEach((cell, colIndex) => {
        const cellValue = cell.v ? cell.toString() : ''
        acc[colIndex] = Math.max(acc[colIndex] || 0, cellValue.length)
      })
      return acc
    }, [])

    ws['!cols'] = columnWidths.map(width => ({ wch: width + 5 }))

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    const excelFileName = `Informe Como Vamos ${dateExcel.dia} ${dateExcel.mes}.xlsx`
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <div>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </div>
  )
}

export default ButtonDownloadExcel
