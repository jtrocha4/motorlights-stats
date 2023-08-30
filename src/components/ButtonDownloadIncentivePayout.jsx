import React from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../styles/excelStyles'

const ButtonDownloadIncentivePayout = ({ title, data }) => {
  const handleDownload = () => {
    const values = ['Vendedor', 'Facturas', 'Meta de Venta', 'Venta (Sin flete)', '% Venta', 'Meta de Recaudo', 'Recaudo', '% Recaudo']
    const wsData = []

    // console.log(excelStyles.headerYellowStyle)

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
      data.forEach(element => {
        const cell = { v: '', s: {} }
        if (value === 'Vendedor') {
          cell.v = element.vendedor
        }
        if (value === 'Facturas') {
          cell.v = element.cantidadFacturas
        }
        if (value === 'Meta de Venta') {
          cell.v = element.metaVentas
        }
        if (value === 'Venta (Sin flete)') {
          cell.v = element.totalVenta
        }
        if (value === '% Venta') {
          cell.v = element.porcentajeVentas
        }
        if (value === 'Meta de Recaudo') {
          cell.v = element.metaRecaudoSinIva
        }
        if (value === 'Recaudo') {
          cell.v = element.totalRecaudo
        }
        if (value === '% Recaudo') {
          cell.v = element.porcentajeRecaudo
        }
        row.push(cell)
      })
      wsData.push(row)
    })

    // const newData = wsData.map(element => {
    //   const data = []
    //   const headers = element[0]
    //   const values = element[1]
    //   data.push(headers, values)
    //   return data
    // })

    const newArray = wsData.map(element => [
      element.map(el => [
        el
      ])
    ])

    // console.log(newArray)

    const newData2 = newArray.map(el =>
      el[0][0]
    )

    console.log(newData2)

    const workbook = XLSX.utils.book_new()
    const sheetName = []

    const ws = XLSX.utils.aoa_to_sheet(newData2, { origin: 'A2' })

    const name = data.map(element => {
      const sellerName = []
      const splitChain = element.vendedor.split(' ')
      sellerName.push(`INCENTIVO ${splitChain[0]} ${splitChain[1]}`)
      sheetName.push(`INCENTIVO ${splitChain[0]} ${splitChain[1]}`)
      return sellerName
    })

    name.forEach(sellerName => {
      XLSX.utils.book_append_sheet(workbook, ws, sellerName[0])
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
