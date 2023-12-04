import React, { useContext } from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../../styles/excelStyles'
import { ReportDetailsContext } from '../../context/reportDetails'

const ButtonDownloadSalesByMunicipality = ({ title, sellerSalesData, getMonth, getYear }) => {
  const { dateSaleItemFile } = useContext(ReportDetailsContext)

  const handleDownload = () => {
    const tableHeaders = []
    const wsData = []

    const monthsArray = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Noviembre', 'Diciembre']

    const reportDetailed = [
      [{ v: 'MOTORLIGHTS S.A.S', s: excelStyles.reportDetailedStyle }],
      [{ v: 'Ventas por Municipio', s: excelStyles.reportDetailedStyle }],
      [{ v: `Entre ${dateSaleItemFile[0]} Y ${dateSaleItemFile[1]}`, s: excelStyles.reportDetailedStyle }]
    ]

    tableHeaders.push([
      { v: 'Departamento', s: excelStyles.headerBlueStyle },
      { v: 'Municipio', s: excelStyles.headerBlueStyle },
      { v: 'Año', s: excelStyles.headerBlueStyle },
      ...monthsArray.map(month => ({ v: month, s: excelStyles.headerBlueStyle })),
      { v: 'Venta Neta', s: excelStyles.headerBlueStyle }
    ])

    const salesByMunicipalities = {}
    const totalSalesBySeller = {}
    sellerSalesData.forEach(element => {
      const department = element.departamentoCliente
      const municipality = element.ciudadCliente
      const netSale = element.ventaNeta
      const month = getMonth(element.fecha)
      const year = getYear(element.fecha)

      if (!salesByMunicipalities[year]) {
        salesByMunicipalities[year] = {}
      }
      if (!salesByMunicipalities[year][month]) {
        salesByMunicipalities[year][month] = {}
      }
      if (!salesByMunicipalities[year][month][department]) {
        salesByMunicipalities[year][month][department] = {}
      }
      if (!salesByMunicipalities[year][month][department][municipality]) {
        salesByMunicipalities[year][month][department][municipality] = 0
      }
      if (!totalSalesBySeller[month]) {
        totalSalesBySeller[month] = 0
      }
      totalSalesBySeller[month] += netSale
      salesByMunicipalities[year][month][department][municipality] = (salesByMunicipalities[year][month][department][municipality] || 0) + netSale
    })

    for (const year in salesByMunicipalities) {
      const months = salesByMunicipalities[year]
      for (const month in months) {
        const departments = months[month]
        for (const department in departments) {
          const municipalities = departments[department]
          for (const municipality in municipalities) {
            wsData.push({
              departamento: { v: department, s: excelStyles.whiteRowStyleTextFormat, t: 's' },
              municipio: { v: municipality, s: excelStyles.whiteRowStyleTextFormat, t: 's' },
              año: { v: year, s: excelStyles.whiteRowStyleTextFormat, t: 's' },
              ...monthsArray.reduce((acc, element) => {
                acc[element] = { v: (months[element] && months[month][department][municipality]) || 0, s: excelStyles.whiteRowStyleCurrencyFormat, t: 'n' }
                return acc
              }, {}),
              sumaVentaNeta: {
                v: Object.values(monthsArray).reduce((acc, element) => acc + (months[element]?.[department][municipality] || 0), 0),
                s: excelStyles.yellowStyleCurrencyFormat,
                t: 'n'
              }
            })
          }
        }
      }
    }

    wsData.push({
      departamento: { v: 'Total general', s: excelStyles.headerYellowStyle, t: 's' },
      municipio: { v: '', s: excelStyles.headerYellowStyle, t: 's' },
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
    const sheetName = 'Ventas por Municipio'

    worksheet['!cols'] = []

    const departmentColumnSize = wsData.reduce((w, r) => Math.max(w, r.departamento.v.length), 10)
    const municipalityColumnSize = wsData.reduce((w, r) => Math.max(w, r.municipio.v.length), 10)

    worksheet['!cols'][0] = { wch: departmentColumnSize + 5 }
    worksheet['!cols'][1] = { wch: municipalityColumnSize }
    worksheet['!cols'][2] = { wch: 7 }
    worksheet['!cols'][3] = { wch: 20 }
    worksheet['!cols'][4] = { wch: 20 }
    worksheet['!cols'][5] = { wch: 20 }
    worksheet['!cols'][6] = { wch: 20 }
    worksheet['!cols'][7] = { wch: 20 }
    worksheet['!cols'][8] = { wch: 20 }
    worksheet['!cols'][9] = { wch: 20 }
    worksheet['!cols'][10] = { wch: 20 }
    worksheet['!cols'][11] = { wch: 20 }
    worksheet['!cols'][12] = { wch: 20 }
    worksheet['!cols'][13] = { wch: 20 }
    worksheet['!cols'][14] = { wch: 25 }

    worksheet['!autofilter'] = { ref: 'A5:C5' }

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

    const excelFileName = 'Informe Ventas por Municipio.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadSalesByMunicipality
