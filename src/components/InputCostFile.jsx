import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { costFileToModel } from '../mappers'
import { DataContext } from './context/data'
import { DateContext } from './context/dateFile'

const InputCostFile = ({ label, toFixed, salesGoalBySeller, collectionGoalBySeller }) => {
  const { setDataCost, excelDataCost, setExcelDataCost } = useContext(DataContext)
  const { setDateCostFile } = useContext(DateContext)

  const handleReadCostFile = (event) => {
    const file = event.target.files[0]
    // eslint-disable-next-line no-undef
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelDataCost(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatDataCost = (headers = [], rows = []) => {
    const costFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        if (header !== 'PorMargen' && header !== 'Costo Unitario' && header !== 'Margen') { // Filtrado de columnas
          rowData[header] = row[index]
        }
      })
      return rowData
    })
    return costFileToModel(costFile)
  }

  const dateFile = excelDataCost[2]

  const headersCostFile = excelDataCost[3]
  const rowsCostFile = excelDataCost.slice(4)
  const formattedDataCost = formatDataCost(headersCostFile, rowsCostFile)

  const extractCostData = (formattedData, salesGoalBySeller = {}, collectionGoalBySeller = {}) => {
    const saleData = {}
    const sale = []
    let currentSeller
    let sellerSales
    let total
    let totalCost
    const uniqueDocs = {}
    let billCounter
    let averageSale

    let goalSale
    let percetageSale
    let pendingSalesTarget
    let pendingCollectionTarget

    let totalWithFreight
    let margin
    let percentageMargin

    let collectionTarget
    let percentageCollected

    let splitChain

    let commission

    const motorlightsObject = {
      cantidadFacturas: 0,
      metaRecaudoSinIva: (collectionGoalBySeller['MOTORLIGHTS S.A.S'] === undefined) ? (0) : (collectionGoalBySeller['MOTORLIGHTS S.A.S']),
      metaVentas: (salesGoalBySeller['MOTORLIGHTS S.A.S'] === undefined) ? (0) : (salesGoalBySeller['MOTORLIGHTS S.A.S']),
      porcentajeRecaudo: 0,
      porcentajeVentas: 0,
      promedioVentas: 0,
      recaudoPendiente: 0,
      totalRecaudo: 0,
      totalVenta: 0,
      vendedor: 'MOTORLIGHTS S.A.S',
      ventasPendiente: 0,
      comisionTotal: 0,
      margen: 0,
      porcentajeMargen: 0
    }

    formattedData.forEach(row => {
      if (row.codigoInventario !== undefined) {
        splitChain = row.codigoInventario.split(' ')
      }
      if (row.vendedor) {
        if (row.vendedor.startsWith('Total')) {
          if (currentSeller) {
            // Calculo de operaciones
            billCounter = Object.keys(uniqueDocs[currentSeller] || {}).length

            averageSale = total / Object.keys(uniqueDocs[currentSeller] || {}).length
            averageSale = (averageSale !== -Infinity) ? (total / Object.keys(uniqueDocs[currentSeller] || {}).length) : 0

            goalSale = salesGoalBySeller[currentSeller] || 0
            percetageSale = (goalSale !== 0) ? ((total * 100) / goalSale) : (0)
            pendingSalesTarget = goalSale - total

            margin = totalWithFreight - totalCost
            percentageMargin = (totalWithFreight !== 0) ? ((margin * 100) / totalWithFreight) : (0)

            collectionTarget = collectionGoalBySeller[currentSeller] || 0
            percentageCollected = 100
            pendingCollectionTarget = collectionGoalBySeller[currentSeller] || 0

            // Aproximacion de los datos
            averageSale = toFixed(averageSale, 2)
            percetageSale = toFixed(percetageSale, 1)
            pendingSalesTarget = toFixed(pendingSalesTarget, 2)
            percentageMargin = toFixed(percentageMargin, 1)

            // Comisiones
            let salesBonus
            if (percetageSale >= 100) {
              salesBonus = total * 0.01
              commission = salesBonus
            }

            saleData[currentSeller] = sellerSales
            sale.push(
              {
                cantidadFacturas: billCounter,
                comisionTotal: 0,
                comisionVenta: commission,
                margen: margin,
                metaRecaudoSinIva: collectionTarget,
                metaVentas: goalSale,
                porcentajeMargen: percentageMargin,
                porcentajeRecaudo: percentageCollected,
                porcentajeVentas: percetageSale,
                promedioVentas: averageSale,
                recaudoPendiente: pendingCollectionTarget,
                totalCosto: totalCost,
                totalRecaudo: 0,
                totalVenta: total,
                vendedor: currentSeller,
                venta: saleData[currentSeller],
                ventasPendiente: pendingSalesTarget
              }
            )
          }
          currentSeller = null
          sellerSales = null
          total = 0
          totalWithFreight = 0
          totalCost = 0
          commission = 0
        } else {
          currentSeller = row.vendedor
          sellerSales = []
          total = 0
          totalWithFreight = 0
          totalCost = 0
          commission = 0
        }
      }
      if (currentSeller && sellerSales) {
        totalWithFreight += row.ventas || 0
      }
      if (currentSeller && sellerSales && !splitChain[1].startsWith('Flete')) {
        sellerSales.push(row)
        total += row.ventas || 0
        totalCost += row.totalCosto || 0
        if (!uniqueDocs[currentSeller]) {
          uniqueDocs[currentSeller] = {}
        }
        if (row.doc.startsWith('FV')) {
          uniqueDocs[currentSeller][row.doc] = true
        }
      }
    })
    if (sale.length) {
      const found = sale.find(el => el.vendedor === 'MOTORLIGHTS S.A.S')
      if (found === undefined) {
        sale.push(motorlightsObject)
      }
    }
    setDataCost(sale)
  }

  useEffect(() => {
    extractCostData(formattedDataCost, salesGoalBySeller, collectionGoalBySeller)
    setDateCostFile(dateFile)
  }, [excelDataCost, salesGoalBySeller, collectionGoalBySeller])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadCostFile} />
    </>
  )
}

export default InputCostFile
