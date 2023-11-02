import React from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../styles/excelStyles'

const ButtonDownloadAnalyticsCostAndSale = ({ title, background, costAndSalesData }) => {
  const handleDownload = () => {
    const tableHeaders = []
    tableHeaders.push([
      { v: 'Vendedor', s: excelStyles.headerGrayStyle },
      { v: 'Cliente', s: excelStyles.headerGrayStyle },
      { v: 'Flete', s: excelStyles.headerGrayStyle },
      { v: 'Municipio', s: excelStyles.headerGrayStyle },
      { v: 'Departamento', s: excelStyles.headerGrayStyle },
      { v: 'Total Ventas', s: excelStyles.headerGrayStyle },
      { v: 'Mes', s: excelStyles.headerGrayStyle },
      { v: 'Categoria', s: excelStyles.headerGrayStyle },
      { v: 'Ventas', s: excelStyles.headerGrayStyle },
      { v: 'Costos', s: excelStyles.headerGrayStyle }
    ])

    const wsData = costAndSalesData.map(row => ({
      vendedor: { v: row.vendedor, s: excelStyles.whiteStyleRow },
      cliente: { v: row.cliente, s: excelStyles.whiteStyleRow },
      Flete: { v: 0, s: excelStyles.whiteStyleRow, t: 'n' },
      municipio: { v: row.ciudadCliente, s: excelStyles.whiteStyleRow },
      departamento: { v: row.departamentoCliente, s: excelStyles.whiteStyleRow },
      TotalVentas: { v: row.valorTotal, s: excelStyles.whiteStyleRowCurrencyFormat, t: 'n' },
      mes: { v: row.fecha, s: excelStyles.whiteStyleRow },
      categoriaProducto: { v: row.categoriaProducto, s: excelStyles.whiteStyleRow },
      ventas: { v: row.venta, s: excelStyles.whiteStyleRowCurrencyFormat, t: 'n' },
      costos: { v: row.costo, s: excelStyles.whiteStyleRowCurrencyFormat, t: 'n' }
    }))

    const worksheet = XLSX.utils.json_to_sheet(wsData)

    const workbook = XLSX.utils.book_new()
    const sheetName = 'Costos y Ventas'

    worksheet['!cols'] = []

    const sellerColumnSize = wsData.reduce((w, r) => Math.max(w, r.vendedor.v.length), 10)
    const customerColumnSize = wsData.reduce((w, r) => Math.max(w, r.cliente.v.length), 10)
    // const municColumnSize = wsData.reduce((w, r) => Math.max(w, r.municipio.v.length), 10)
    const deptColumnSize = wsData.reduce((w, r) => Math.max(w, r.departamento.v.length), 10)
    const productCategoryColumnSize = wsData.reduce((w, r) => Math.max(w, r.categoriaProducto.v.length), 10)

    const currencyFormatColumnSize = 15

    worksheet['!cols'][0] = { wch: sellerColumnSize }
    worksheet['!cols'][1] = { wch: customerColumnSize }
    worksheet['!cols'][3] = { wch: deptColumnSize }
    worksheet['!cols'][4] = { wch: deptColumnSize }
    worksheet['!cols'][5] = { wch: deptColumnSize }
    worksheet['!cols'][5] = { wch: currencyFormatColumnSize }
    worksheet['!cols'][7] = { wch: productCategoryColumnSize }
    worksheet['!cols'][8] = { wch: currencyFormatColumnSize }
    worksheet['!cols'][9] = { wch: currencyFormatColumnSize }

    worksheet['!autofilter'] = { ref: 'A1:J1' }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.utils.sheet_add_aoa(worksheet, tableHeaders, { origin: 'A1' })

    const excelFileName = 'Informe Costos y Ventas.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }

  return (
    <>
      <button type='button' className={`btn btn-outline-${background}`} onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadAnalyticsCostAndSale
