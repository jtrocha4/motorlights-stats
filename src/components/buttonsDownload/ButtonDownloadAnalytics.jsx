import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../../styles/excelStyles'
import { ReportDetailsContext } from '../../context/reportDetails'

const ButtonDownloadAnalytics = ({ title, background = 'primary', sellerSalesData }) => {
  const { dateSaleItemFile } = useContext(ReportDetailsContext)

  const handleDownload = () => {
    const tableHeaders = []

    const reportDetailed = [
      [{ v: 'MOTORLIGHTS S.A.S', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Ventas Por Forma de Pago Detallado por Item', s: excelStyles.reportDetailedStyle }],
      [{ v: `${dateSaleItemFile}`, s: excelStyles.reportDetailedStyle }]
    ]

    tableHeaders.push([
      { v: 'Vendedor', s: excelStyles.headerGrayStyle },
      { v: 'Documento', s: excelStyles.headerGrayStyle },
      { v: 'Fecha', s: excelStyles.headerGrayStyle },
      { v: 'ID Tercero', s: excelStyles.headerGrayStyle },
      { v: 'Tercero', s: excelStyles.headerGrayStyle },
      { v: 'Municipio', s: excelStyles.headerGrayStyle },
      { v: 'Departamento', s: excelStyles.headerGrayStyle },
      { v: 'ID Producto', s: excelStyles.headerGrayStyle },
      { v: 'Producto', s: excelStyles.headerGrayStyle },
      { v: 'Categoria', s: excelStyles.headerGrayStyle },
      { v: 'Unidades', s: excelStyles.headerGrayStyle },
      { v: 'Valor Unitario', s: excelStyles.headerGrayStyle },
      { v: 'Venta Bruta', s: excelStyles.headerGrayStyle },
      { v: 'Descuento', s: excelStyles.headerGrayStyle },
      { v: 'Venta Neta', s: excelStyles.headerGrayStyle },
      { v: 'IVA', s: excelStyles.headerGrayStyle },
      { v: 'Valor Total', s: excelStyles.headerGrayStyle }
    ])

    const wsData = sellerSalesData.map(row => ({
      vendedor: { v: row.vendedor, s: excelStyles.whiteRowStyleTextFormat },
      doc: { v: row.doc, s: excelStyles.whiteRowStyleTextFormat },
      fecha: { v: row.fecha, s: excelStyles.whiteRowStyleNumberFormat },
      idCliente: { v: row.idCliente, s: excelStyles.whiteRowStyleNumberFormat, t: 'n' },
      cliente: { v: row.cliente, s: excelStyles.whiteRowStyleTextFormat },
      ciudadCliente: { v: row.ciudadCliente, s: excelStyles.whiteRowStyleTextFormat },
      departamentoCliente: { v: row.departamentoCliente, s: excelStyles.whiteRowStyleTextFormat },
      idProducto: { v: row.idProducto, s: excelStyles.whiteRowStyleNumberFormat, t: 'n' },
      producto: { v: row.producto, s: excelStyles.whiteRowStyleTextFormat },
      categoriaProducto: { v: row.categoriaProducto, s: excelStyles.whiteRowStyleTextFormat },
      unidadesProducto: { v: row.unidadesProducto, s: excelStyles.whiteRowStyleNumberFormat, t: 'n' },
      valorUnitario: { v: row.valorUnitario, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' },
      ventaBruta: { v: row.ventaBruta, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' },
      descuento: { v: row.descuento, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' },
      ventaNeta: { v: row.ventaNeta, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' },
      iva: { v: row.iva, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' },
      valorTotal: { v: row.valorTotal, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' }
    }))

    const worksheet = XLSX.utils.json_to_sheet(wsData, { origin: 'A5' })

    const workbook = XLSX.utils.book_new()
    const sheetName = 'Macro ventas'

    // Tamaño de las columnas
    worksheet['!cols'] = []

    const sellerColumnSize = wsData.reduce((w, r) => Math.max(w, r.vendedor.v.length), 10)
    const customerColumnSize = wsData.reduce((w, r) => Math.max(w, r.cliente.v.length), 10)
    const docColumnSize = wsData.reduce((w, r) => Math.max(w, r.doc.v.length), 10)
    const deptColumnSize = wsData.reduce((w, r) => Math.max(w, r.departamentoCliente.v.length), 10)
    const idProductColumnSize = wsData.reduce((w, r) => Math.max(w, r.idProducto.v.length), 10)
    const productColumnSize = wsData.reduce((w, r) => Math.max(w, r.producto.v.length), 10)
    const productCategoryColumnSize = wsData.reduce((w, r) => Math.max(w, r.categoriaProducto.v.length), 10)

    const currencyFormatColumnSize = 15

    worksheet['!cols'][0] = { wch: sellerColumnSize }

    worksheet['!cols'][1] = { wch: docColumnSize }
    worksheet['!cols'][4] = { wch: customerColumnSize }
    worksheet['!cols'][6] = { wch: deptColumnSize + 2 }
    worksheet['!cols'][7] = { wch: idProductColumnSize }
    worksheet['!cols'][8] = { wch: productColumnSize }
    worksheet['!cols'][9] = { wch: productCategoryColumnSize }
    worksheet['!cols'][11] = { wch: currencyFormatColumnSize }
    worksheet['!cols'][12] = { wch: currencyFormatColumnSize }
    worksheet['!cols'][13] = { wch: currencyFormatColumnSize }
    worksheet['!cols'][14] = { wch: currencyFormatColumnSize }
    worksheet['!cols'][15] = { wch: currencyFormatColumnSize }
    worksheet['!cols'][16] = { wch: currencyFormatColumnSize }

    worksheet['!autofilter'] = { ref: 'A5:Q5' }

    const mergeOptions = {
      '!merge': [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 16 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 16 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 16 } }
      ]
    }

    worksheet['!merges'] = mergeOptions['!merge']

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.utils.sheet_add_aoa(worksheet, reportDetailed, { origin: 'A1' })
    XLSX.utils.sheet_add_aoa(worksheet, tableHeaders, { origin: 'A5' })

    const excelFileName = 'Informe Macro Ventas.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }

  return (
    <>
      <button type='button' className={`btn btn-outline-${background}`} onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadAnalytics
