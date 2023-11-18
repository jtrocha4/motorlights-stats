import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import _ from 'lodash'
import excelStyles from '../../styles/excelStyles'
import { DataExcelContext } from '../../context/dataExcel'

// Cambiar nombre del componente a ButtonDownloadHowAreYouDoing

const ButtonDownloadExcel = ({ title, data, toFixed, splitName }) => {
  const { dateExcel } = useContext(DataExcelContext)

  const excelPercentageFormat = (percentageValue) => {
    const percentage = parseFloat(percentageValue / 100)
    return percentage
  }

  const handleDownload = () => {
    const dates = ['Mes']
    const headers = ['Vendedor']
    const values = ['Total ventas', 'Cantidad de facturas', 'Promedio de ventas', 'Clientes nuevos', 'Margen bruto', '% Margen bruto', 'Meta ventas', '% Venta', 'Ventas pendiente', 'Total recaudo', 'Meta recaudo sin iva', '% Recaudo', 'Recaudo pendiente']

    const wsData = []
    const wsDataPercentaje = []

    const reportDetailed = [
      [{ v: 'MOTORLIGHTS S.A.S', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Como Vamos', s: excelStyles.reportDetailedStyle }],
      [{ v: `Entre ${dateExcel.fechaInicial} Y ${dateExcel.fechaFinal}`, s: excelStyles.reportDetailedStyle }]
    ]

    dates.forEach(date => {
      const cell = { v: '', s: {}, t: '' }
      let row = [date]
      if (date === 'Mes') {
        cell.v = `${dateExcel.mes}`
        cell.s = excelStyles.headerYellowStyle
      }
      row = [cell]
      wsData.push([...row,
        {
          v: excelPercentageFormat(dateExcel.porcentajeDiasTranscurridos),
          t: 'n',
          s: excelStyles.percentageYellowStyle
        }
      ])
    })

    headers.forEach(header => {
      const cellHeader = { v: '', s: {} }
      let row = [header]
      if (header === 'Vendedor') {
        cellHeader.v = 'Vendedor'
        cellHeader.s = excelStyles.headerBlackStyle
      }
      row = [cellHeader]
      data.forEach(element => {
        const firstAndMiddleName = splitName(element.vendedor)
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
      if (value === 'Clientes nuevos') {
        cellValue.v = value
        cellValue.s = excelStyles.headerOrangeStyle
      }
      if (value === 'Margen bruto') {
        cellValue.v = value
        cellValue.s = excelStyles.headerOrangeStyle
      }
      if (value === '% Margen bruto') {
        cellValue.v = value
        cellValue.s = excelStyles.headerOrangeStyle
      }
      if (value === 'Meta ventas') {
        cellValue.v = value
        cellValue.s = excelStyles.headerBlackStyle
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
        const cell = { v: '', s: {}, t: '' }
        if (value === 'Total ventas') {
          cell.v = item.totalVenta
          cell.t = 'n'
          cell.s = excelStyles.yellowStyleCurrencyFormat
        }
        if (value === 'Cantidad de facturas') {
          cell.v = item.cantidadFacturas
          cell.t = 'n'
          cell.s = excelStyles.grayStyle
        }
        if (value === 'Promedio de ventas') {
          cell.v = item.promedioVentas
          cell.t = 'n'
          cell.s = excelStyles.grayStyleCurrencyFormat
        }
        if (value === 'Clientes nuevos') {
          cell.v = item.clientesNuevos
          cell.t = 'n'
          cell.s = excelStyles.orangeStyle
        }
        if (value === 'Margen bruto') {
          cell.v = item.margen
          cell.t = 'n'
          cell.s = excelStyles.orangeStyleCurrencyFormat
        }
        if (value === '% Margen bruto') {
          cell.v = excelPercentageFormat(item.porcentajeMargen)
          cell.t = 'n'
          cell.s = excelStyles.percentageOrangeStyle
        }
        if (value === 'Meta ventas') {
          cell.v = item.metaVentas
          cell.t = 'n'
          cell.s = excelStyles.blackStyleCurrencyFormat
        }
        if (value === '% Venta') {
          cell.v = excelPercentageFormat(item.porcentajeVentas)
          cell.t = 'n'
          cell.s = excelStyles.percentageWhiteStyle
        }
        if (value === 'Ventas pendiente') {
          cell.v = item.ventasPendiente
          cell.t = 'n'
          cell.s = excelStyles.whiteStyleCurrencyFormat
        }
        if (value === 'Total recaudo') {
          cell.v = item.totalRecaudo
          cell.t = 'n'
          cell.s = excelStyles.yellowStyleCurrencyFormat
        }
        if (value === 'Meta recaudo sin iva') {
          cell.v = item.metaRecaudoSinIva
          cell.t = 'n'
          cell.s = excelStyles.blackStyleCurrencyFormat
        }
        if (value === '% Recaudo') {
          cell.v = excelPercentageFormat(item.porcentajeRecaudo)
          cell.t = 'n'
          cell.s = excelStyles.percentageWhiteStyle
        }
        if (value === 'Recaudo pendiente') {
          cell.v = item.recaudoPendiente
          cell.t = 'n'
          cell.s = excelStyles.whiteStyleCurrencyFormat
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
        recaudoPendiente: 0,
        margen: 0,
        costo: 0,
        ventaConFlete: 0,
        porcentajeMargen: 0,
        clientesNuevos: 0
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

      total.clientesNuevos = data.reduce((acc, item) => acc + item.clientesNuevos, 0)

      total.margen = data.reduce((acc, item) => acc + item.margen, 0)
      total.costo = data.reduce((acc, item) => acc + item.totalCosto, 0)
      total.ventaConFlete = data.reduce((acc, item) => acc + item.totalVentaConFlete, 0)
      total.porcentajeMargen = (total.margen * 100) / total.ventas

      // Aproximaciones
      total.porcentajeVentas = toFixed(total.porcentajeVentas, 1)
      total.porcentajeRecaudo = toFixed(total.porcentajeRecaudo, 1)
      total.porcentajeMargen = toFixed(total.porcentajeMargen, 1)

      const cell = { v: '', s: {}, t: '' }
      if (value === 'Total ventas') {
        cell.v = total.ventas
        cell.t = 'n'
        cell.s = excelStyles.yellowStyleCurrencyFormat
        row.push(cell)
      }
      if (value === 'Cantidad de facturas') {
        cell.v = total.facturas
        cell.t = 'n'
        cell.s = excelStyles.grayStyle
        row.push(cell)
      }
      if (value === 'Promedio de ventas') {
        cell.v = total.promedioVentas
        cell.t = 'n'
        cell.s = excelStyles.grayStyleCurrencyFormat
        row.push(cell)
      }
      if (value === 'Clientes nuevos') {
        cell.v = total.clientesNuevos
        cell.t = 'n'
        cell.s = excelStyles.orangeStyle
        row.push(cell)
      }
      if (value === 'Margen bruto') {
        cell.v = total.margen
        cell.t = 'n'
        cell.s = excelStyles.orangeStyleCurrencyFormat
        row.push(cell)
      }
      if (value === '% Margen bruto') {
        cell.v = excelPercentageFormat(total.porcentajeMargen)
        cell.t = 'n'
        cell.s = excelStyles.percentageOrangeStyle
        row.push(cell)
      }
      if (value === 'Meta ventas') {
        cell.v = total.metaVentas
        cell.t = 'n'
        cell.s = excelStyles.blackStyleCurrencyFormat
        row.push(cell)
      }
      if (value === '% Venta') {
        cell.v = excelPercentageFormat(total.porcentajeVentas)
        cell.t = 'n'
        cell.s = excelStyles.percentageWhiteStyle
        row.push(cell)
      }
      if (value === 'Ventas pendiente') {
        cell.v = total.ventasPendiente
        cell.t = 'n'
        cell.s = excelStyles.whiteStyleCurrencyFormat
        row.push(cell)
      }
      if (value === 'Total recaudo') {
        cell.v = total.recaudo
        cell.t = 'n'
        cell.s = excelStyles.yellowStyleCurrencyFormat
        row.push(cell)
      }
      if (value === 'Meta recaudo sin iva') {
        cell.v = total.metaRecaudoSinIva
        cell.t = 'n'
        cell.s = excelStyles.blackStyleCurrencyFormat
        row.push(cell)
      }
      if (value === '% Recaudo') {
        cell.v = excelPercentageFormat(total.porcentajeRecaudo)
        cell.t = 'n'
        cell.s = excelStyles.percentageWhiteStyle
        row.push(cell)
      }
      if (value === 'Recaudo pendiente') {
        cell.v = total.recaudoPendiente
        cell.t = 'n'
        cell.s = excelStyles.whiteStyleCurrencyFormat
        row.push(cell)
      }
      wsData.push(row)
    })

    const wsDateData = []
    const workDays = []
    const daysElapsed = []
    const PercentageDaysElapsed = []
    workDays.push({
      v: 'Dias habiles del mes',
      s: excelStyles.headerWhiteStyle
    }, {
      v: dateExcel.diasLaborales,
      t: 'n',
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
      t: 'n',
      s: excelStyles.whiteStyle
    })
    PercentageDaysElapsed.push({
      v: '',
      s: {}
    }, {
      v: excelPercentageFormat(dateExcel.porcentajeDiasTranscurridos),
      t: 'n',
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
      v: excelPercentageFormat(dateExcel.porcentajeDiasTranscurridos),
      t: 'n',
      s: excelStyles.percentageYellowStyle
    })

    wsDataPercentaje.push(newWsData)
    const wsSellerData = _.cloneDeep(wsData[1])
    wsSellerData[0].v = 'Vendedores'
    wsSellerData[0].s = excelStyles.headerBlackStyle
    wsDataPercentaje.push(wsSellerData)
    wsDataPercentaje.push(wsData[9]) // Porcentaje Ventas
    wsDataPercentaje.push(wsData[13]) // Porcentaje Recaudo

    const workbook = XLSX.utils.book_new()
    const sheetName = 'Resumen'

    const worksheet = XLSX.utils.aoa_to_sheet(wsData, { origin: 'A5' })
    XLSX.utils.sheet_add_aoa(worksheet, reportDetailed, { origin: 'A1' })
    XLSX.utils.sheet_add_aoa(worksheet, wsDateData, { origin: 'A21' })
    XLSX.utils.sheet_add_aoa(worksheet, wsDataPercentaje, { origin: 'A25' })

    const columnWidths = wsData.reduce((acc, row) => {
      row.forEach((cell, colIndex) => {
        const cellValue = cell.v ? cell.toString() : ''
        acc[colIndex] = Math.max(acc[colIndex] || 0, cellValue.length)
      })
      return acc
    }, [])

    worksheet['!cols'] = []
    worksheet['!cols'] = columnWidths.map(width => ({ wch: width + 7 }))
    worksheet['!cols'][0] = { wch: 21 }
    worksheet['!cols'][2] = { wch: 33 }

    const mergeOptions = {
      '!merge': [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } }
      ]
    }

    worksheet['!merges'] = mergeOptions['!merge']

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    const excelFileName = `Informe Como Vamos ${dateExcel.dia} ${dateExcel.mes}.xlsx`
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadExcel
