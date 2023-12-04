import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import { ReportDetailsContext } from '../../context/reportDetails'
import excelStyles from '../../styles/excelStyles'

const ButtonDownloadSalesProductSellerByMunicipality = ({ title, sellerSalesData, getMonth, getYear }) => {
  const { dateSaleItemFile } = useContext(ReportDetailsContext)

  const handleDownload = () => {
    const tableHeaders = []
    const wsData = []

    const monthsArray = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Noviembre', 'Diciembre']

    const reportDetailed = [
      [{ v: 'MOTORLIGHTS S.A.S', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Ventas Producto Vendedor por Municipio', s: excelStyles.reportDetailedStyle }],
      [{ v: `Entre ${dateSaleItemFile[0]} Y ${dateSaleItemFile[1]}`, s: excelStyles.reportDetailedStyle }]
    ]

    tableHeaders.push([
      { v: 'Vendedor', s: excelStyles.headerBlueStyle },
      { v: 'Departamento', s: excelStyles.headerBlueStyle },
      { v: 'Municipio', s: excelStyles.headerBlueStyle },
      { v: 'Categoria Producto', s: excelStyles.headerBlueStyle },
      { v: 'Producto', s: excelStyles.headerBlueStyle },
      { v: 'Año', s: excelStyles.headerBlueStyle },
      ...monthsArray.map(month => ({ v: month, s: excelStyles.headerBlueStyle })),
      { v: 'Venta Neta', s: excelStyles.headerBlueStyle }
    ])

    const salesByMunicipalities = {}
    const totalSalesBySeller = {}
    sellerSalesData.forEach(element => {
      const seller = element.vendedor
      const department = element.departamentoCliente
      const municipality = element.ciudadCliente
      const productCategory = element.categoriaProducto
      const idProduct = element.idProducto
      const product = `${idProduct} ${element.producto}`
      const netSale = element.ventaNeta
      const month = getMonth(element.fecha)
      const year = getYear(element.fecha)

      if (!salesByMunicipalities[year]) {
        salesByMunicipalities[year] = {}
      }
      if (!salesByMunicipalities[year][month]) {
        salesByMunicipalities[year][month] = {}
      }
      if (!salesByMunicipalities[year][month][seller]) {
        salesByMunicipalities[year][month][seller] = {}
      }
      if (!salesByMunicipalities[year][month][seller][department]) {
        salesByMunicipalities[year][month][seller][department] = {}
      }
      if (!salesByMunicipalities[year][month][seller][department][municipality]) {
        salesByMunicipalities[year][month][seller][department][municipality] = {}
      }
      if (!salesByMunicipalities[year][month][seller][department][municipality][productCategory]) {
        salesByMunicipalities[year][month][seller][department][municipality][productCategory] = {}
      }
      if (!salesByMunicipalities[year][month][seller][department][municipality][productCategory][product]) {
        salesByMunicipalities[year][month][seller][department][municipality][productCategory][product] = 0
      }
      if (!totalSalesBySeller[month]) {
        totalSalesBySeller[month] = 0
      }
      totalSalesBySeller[month] += netSale
      salesByMunicipalities[year][month][seller][department][municipality][productCategory][product] = (salesByMunicipalities[year][month][seller][department][municipality][productCategory][product] || 0) + netSale
    })

    for (const year in salesByMunicipalities) {
      const months = salesByMunicipalities[year]
      for (const month in months) {
        const sellers = months[month]
        for (const seller in sellers) {
          const departments = sellers[seller]
          for (const department in departments) {
            const municipalities = departments[department]
            for (const municipality in municipalities) {
              const categoryProducts = municipalities[municipality]
              for (const productCategory in categoryProducts) {
                const products = categoryProducts[productCategory]
                for (const product in products) {
                  wsData.push({
                    vendedor: { v: seller, s: excelStyles.whiteRowStyleTextFormat, t: 's' },
                    departamento: { v: department, s: excelStyles.whiteRowStyleTextFormat, t: 's' },
                    municipio: { v: municipality, s: excelStyles.whiteRowStyleTextFormat, t: 's' },
                    categoriaProducto: { v: productCategory, s: excelStyles.whiteRowStyleTextFormat, t: 's' },
                    producto: { v: product, s: excelStyles.whiteRowStyleTextFormat, t: 's' },
                    año: { v: year, s: excelStyles.whiteRowStyleTextFormat, t: 's' },
                    ...monthsArray.reduce((acc, element) => {
                      acc[element] = { v: (months[element] && months[month][seller][department][municipality][productCategory][product]) || 0, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' }
                      return acc
                    }, {}),
                    sumaVentaNeta: {
                      v: Object.values(monthsArray).reduce((acc, element) => acc + (months[element]?.[seller][department][municipality][productCategory][product] || 0), 0),
                      s: excelStyles.yellowStyleCurrencyFormat,
                      t: 'n'
                    }
                  })
                }
              }
            }
          }
        }
      }
    }

    wsData.push({
      vendedor: { v: 'Total general', s: excelStyles.headerYellowStyle, t: 's' },
      departamento: { v: '', s: excelStyles.headerYellowStyle, t: 's' },
      municipio: { v: '', s: excelStyles.headerYellowStyle, t: 's' },
      categoriaProducto: { v: '', s: excelStyles.headerYellowStyle, t: 's' },
      producto: { v: '', s: excelStyles.headerYellowStyle, t: 's' },
      año: { v: '', s: excelStyles.headerYellowStyle, t: 's' },
      ...monthsArray.reduce((acc, month) => {
        acc[month] = { v: totalSalesBySeller[month] || 0, s: excelStyles.yellowStyleCurrencyFormat, t: 'n' }
        return acc
      }, {}),
      sumaVentaNeta: {
        v: Object.values(totalSalesBySeller).reduce((acc, val) => acc + val, 0) || 0,
        s: excelStyles.yellowStyleCurrencyFormat,
        t: 'n'
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(wsData, { origin: 'A5' })
    const workbook = XLSX.utils.book_new()
    const sheetName = 'Ventas Cliente Vend por Munic'

    worksheet['!cols'] = []
    const sellerColumnSize = wsData.reduce((w, r) => Math.max(w, r.vendedor.v.length), 10)
    const departmentColumnSize = wsData.reduce((w, r) => Math.max(w, r.departamento.v.length), 10)
    const municipalityColumnSize = wsData.reduce((w, r) => Math.max(w, r.municipio.v.length), 10)
    const productCategoryColumnSize = wsData.reduce((w, r) => Math.max(w, r.categoriaProducto.v.length), 10)
    const productColumnSize = wsData.reduce((w, r) => Math.max(w, r.producto.v.length), 10)

    worksheet['!cols'][0] = { wch: sellerColumnSize }
    worksheet['!cols'][1] = { wch: departmentColumnSize + 5 }
    worksheet['!cols'][2] = { wch: municipalityColumnSize }
    worksheet['!cols'][3] = { wch: productCategoryColumnSize }
    worksheet['!cols'][4] = { wch: productColumnSize }
    worksheet['!cols'][5] = { wch: 7 }
    worksheet['!cols'][6] = { wch: 20 }
    worksheet['!cols'][7] = { wch: 20 }
    worksheet['!cols'][8] = { wch: 20 }
    worksheet['!cols'][9] = { wch: 20 }
    worksheet['!cols'][10] = { wch: 20 }
    worksheet['!cols'][11] = { wch: 20 }
    worksheet['!cols'][12] = { wch: 20 }
    worksheet['!cols'][13] = { wch: 20 }
    worksheet['!cols'][14] = { wch: 20 }
    worksheet['!cols'][15] = { wch: 20 }
    worksheet['!cols'][16] = { wch: 20 }
    worksheet['!cols'][17] = { wch: 25 }

    worksheet['!autofilter'] = { ref: 'A5:E5' }

    const mergeOptions = {
      '!merge': [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 17 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 17 } }
      ]
    }

    worksheet['!merges'] = mergeOptions['!merge']

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.utils.sheet_add_aoa(worksheet, reportDetailed, { origin: 'A1' })
    XLSX.utils.sheet_add_aoa(worksheet, tableHeaders, { origin: 'A5' })

    const excelFileName = 'Informe Ventas Cliente Vendedor por Municipio.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadSalesProductSellerByMunicipality
