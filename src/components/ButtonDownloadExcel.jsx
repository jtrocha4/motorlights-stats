import React, { useState } from 'react'
import XLSX from 'xlsx-js-style'

const ButtonDownloadExcel = ({ title, data, currencyFormat, toFixed }) => {
  // const [loading, setLoading] = useState(false)

  const handleDownload = () => {
    const headers = ['Vendedor', ...data.map(item => item.vendedor), 'Total']
    const values = ['Total ventas', 'Cantidad de facturas', 'Promedio de ventas', 'Meta ventas', '% Venta', 'Ventas pendiente', 'Total recaudo', 'Meta recaudo sin iva', '% Recaudo', 'Recaudo pendiente']

    const wsData = [headers]

    const yellowStyle = {
      fill: { fgColor: { rgb: 'FFFF00' } },
      alignment: { horizontal: 'right' },
      font: {
        bold: true
      },
      border: {
        right: {
          style: 'thin',
          color: '000000'
        },
        left: {
          style: 'thin',
          color: '000000'
        },
        top: {
          style: 'thin',
          color: '000000'
        },
        bottom: {
          style: 'thin',
          color: '000000'
        }
      }
    }

    const grayStyle = {
      fill: { fgColor: { rgb: 'BFBFBF' } },
      alignment: { horizontal: 'right' },
      font: {
        bold: true
      },
      border: {
        right: {
          style: 'thin',
          color: '000000'
        },
        left: {
          style: 'thin',
          color: '000000'
        },
        top: {
          style: 'thin',
          color: '000000'
        },
        bottom: {
          style: 'thin',
          color: '000000'
        }
      }
    }

    const whiteStyle = {
      fill: { fgColor: { rgb: 'FFFFFF' } },
      alignment: { horizontal: 'right' },
      font: {
        bold: true
      },
      border: {
        right: {
          style: 'thin',
          color: '000000'
        },
        left: {
          style: 'thin',
          color: '000000'
        },
        top: {
          style: 'thin',
          color: '000000'
        },
        bottom: {
          style: 'thin',
          color: '000000'
        }
      }
    }

    const blackStyle = {
      fill: { fgColor: { rgb: '000000' } },
      alignment: { horizontal: 'right' },
      font: {
        bold: true,
        color: { rgb: 'FFFFFF' }
      },
      border: {
        right: {
          style: 'thin',
          color: '000000'
        },
        left: {
          style: 'thin',
          color: '000000'
        },
        top: {
          style: 'thin',
          color: '000000'
        },
        bottom: {
          style: 'thin',
          color: '000000'
        }
      }
    }

    values.forEach(value => {
      const row = [value]
      data.forEach(item => {
        const cell = { v: '', s: {} }
        if (value === 'Total ventas') {
          cell.v = currencyFormat(item.totalVenta)
          cell.s = yellowStyle
        }
        if (value === 'Cantidad de facturas') {
          cell.v = item.cantidadFacturas
          cell.s = grayStyle
        }
        if (value === 'Promedio de ventas') {
          cell.v = currencyFormat(item.promedioVentas)
          cell.s = grayStyle
        }
        if (value === 'Meta ventas') {
          cell.v = currencyFormat(item.metaVentas)
          cell.s = blackStyle
        }
        if (value === '% Venta') {
          cell.v = item.porcentajeVentas
          cell.s = whiteStyle
        }
        if (value === 'Ventas pendiente') {
          cell.v = currencyFormat(item.ventasPendiente)
          cell.s = whiteStyle
        }
        if (value === 'Total recaudo') {
          cell.v = currencyFormat(item.totalRecaudo)
          cell.s = yellowStyle
        }
        if (value === 'Meta recaudo sin iva') {
          cell.v = currencyFormat(item.metaRecaudoSinIva)
          cell.s = blackStyle
        }
        if (value === '% Recaudo') {
          cell.v = item.porcentajeRecaudo
          cell.s = whiteStyle
        }
        if (value === 'Recaudo pendiente') {
          cell.v = currencyFormat(item.recaudoPendiente)
          cell.s = whiteStyle
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
        cell.s = yellowStyle
        row.push(cell)
      }
      if (value === 'Cantidad de facturas') {
        cell.v = currencyFormat(total.facturas)
        cell.s = grayStyle
        row.push(cell)
      }
      if (value === 'Promedio de ventas') {
        cell.v = currencyFormat(total.promedioVentas)
        cell.s = grayStyle
        row.push(cell)
      }
      if (value === 'Meta ventas') {
        cell.v = currencyFormat(total.metaVentas)
        cell.s = blackStyle
        row.push(cell)
      }
      if (value === '% Venta') {
        cell.v = total.porcentajeVentas
        cell.s = whiteStyle
        row.push(cell)
      }
      if (value === 'Ventas pendiente') {
        cell.v = currencyFormat(total.ventasPendiente)
        cell.s = whiteStyle
        row.push(cell)
      }
      if (value === 'Total recaudo') {
        cell.v = currencyFormat(total.recaudo)
        cell.s = yellowStyle
        row.push(cell)
      }
      if (value === 'Meta recaudo sin iva') {
        cell.v = currencyFormat(total.metaRecaudoSinIva)
        cell.s = blackStyle
        row.push(cell)
      }
      if (value === '% Recaudo') {
        cell.v = total.porcentajeRecaudo
        cell.s = whiteStyle
        row.push(cell)
      }
      if (value === 'Recaudo pendiente') {
        cell.v = currencyFormat(total.recaudoPendiente)
        cell.s = whiteStyle
        row.push(cell)
      }
      wsData.push(row)
    })

    const workbook = XLSX.utils.book_new()
    const sheetName = 'Resumen'
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    console.log(ws)

    const columnWidths = wsData.reduce((acc, row) => {
      row.forEach((cell, colIndex) => {
        const cellValue = cell ? cell.toString() : ''
        acc[colIndex] = Math.max(acc[colIndex] || 0, cellValue.length)
      })
      return acc
    }, [])

    ws['!cols'] = columnWidths.map(width => ({ wch: width + 2 }))

    XLSX.utils.book_append_sheet(workbook, ws, sheetName)

    const excelFileName = 'Informe Como Vamos.xlsx'
    XLSX.writeFile(workbook, excelFileName)

    console.log(`Archivo "${excelFileName}" generado exitosamente.`)
  }
  return (
    <div>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </div>
  )
}

export default ButtonDownloadExcel
