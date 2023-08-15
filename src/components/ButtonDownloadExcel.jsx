import React, { useState } from 'react'
import * as XLSX from 'xlsx'

const ButtonDownloadExcel = ({ title, data, currencyFormat }) => {
  // const [loading, setLoading] = useState(false)

  const handleDownload = () => {
    const headers = ['Vendedor', ...data.map(item => item.vendedor), 'Total']
    const values = ['Total ventas', 'Cantidad de facturas', 'Promedio de ventas', 'Meta ventas', '% Venta', 'Ventas pendiente', 'Total recaudo', 'Meta recaudo sin iva', '% Recaudo', 'Recaudo pendiente']

    const wsData = [headers]

    values.forEach(value => {
      const row = [value]
      data.forEach(item => {
        switch (value) {
          case 'Total ventas':
            row.push([currencyFormat(item.totalVenta)])
            break
          case 'Cantidad de facturas':
            row.push(item.cantidadFacturas)
            break
          case 'Promedio de ventas':
            row.push(currencyFormat(item.promedioVentas))
            break
          case 'Meta ventas':
            row.push(currencyFormat(item.metaVentas))
            break
          case '% Venta':
            row.push(item.porcentajeVentas)
            break
          case 'Ventas pendiente':
            row.push(currencyFormat(item.ventasPendiente))
            break
          case 'Total recaudo':
            row.push(currencyFormat(item.totalRecaudo))
            break
          case 'Meta recaudo sin iva':
            row.push(currencyFormat(item.metaRecaudoSinIva))
            break
          case '% Recaudo':
            row.push(item.porcentajeRecaudo)
            break
          case 'Recaudo pendiente':
            row.push(currencyFormat(item.recaudoPendiente))
            break
          default:
            break
        }
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

      if (value === 'Total ventas') {
        row.push(currencyFormat(total.ventas))
      }
      if (value === 'Cantidad de facturas') {
        row.push(total.facturas)
      }
      if (value === 'Promedio de ventas') {
        row.push(currencyFormat(total.promedioVentas))
      }
      if (value === 'Meta ventas') {
        row.push(currencyFormat(total.metaVentas))
      }
      if (value === '% Venta') {
        row.push(currencyFormat(total.porcentajeVentas))
      }
      if (value === 'Ventas pendiente') {
        row.push(currencyFormat(total.ventasPendiente))
      }
      if (value === 'Total recaudo') {
        row.push(currencyFormat(total.recaudo))
      }
      if (value === 'Meta recaudo sin iva') {
        row.push(currencyFormat(total.metaRecaudoSinIva))
      }
      if (value === '% Recaudo') {
        row.push(currencyFormat(total.porcentajeRecaudo))
      }
      if (value === 'Recaudo pendiente') {
        row.push(currencyFormat(total.recaudoPendiente))
      }
      wsData.push(row)
    })

    const workbook = XLSX.utils.book_new()
    const sheetName = 'Resumen'
    const ws = XLSX.utils.aoa_to_sheet(wsData)

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
