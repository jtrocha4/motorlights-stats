import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { costFileToModel } from '../../mappers'
import { ReportDetailsContext } from '../../context/reportDetails'
import { DataContext } from '../../context/data'
import { DataExcelContext } from '../../context/dataExcel'

const InputCostFile = ({ label, toFixed, salesGoalBySeller, collectionGoalBySeller, portfolioClientsGoals, extractIdNumber, extractText, extractDate, removeExtraSpaces }) => {
  const { setData, sellers, inventoryTurnover } = useContext(DataContext)
  const { excelDataCost, setExcelDataCost } = useContext(DataExcelContext)
  const { setDateCostFile, setCostReportName } = useContext(ReportDetailsContext)

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
        rowData[header] = row[index]
      })
      return rowData
    })
    return costFileToModel(costFile)
  }

  const reportName = excelDataCost[1]
  const reportDate = extractDate(excelDataCost[2]) || []

  const reportHeader = excelDataCost[3]
  const reportRows = excelDataCost.slice(4)
  const formattedDataCost = formatDataCost(reportHeader, reportRows)

  const getSalesGoal = (sellerName, salesGoalBySeller) => {
    if (salesGoalBySeller[sellerName] !== undefined) {
      return salesGoalBySeller[sellerName]
    } else {
      return 0
    }
  }

  const getGoalCollection = (sellerName, collectionGoalBySeller) => {
    if (collectionGoalBySeller[sellerName] !== undefined) {
      return collectionGoalBySeller[sellerName]
    } else {
      return 0
    }
  }

  const getPortfolioClientsGoals = (sellerName, portfolioClientsGoal) => {
    if (portfolioClientsGoal[sellerName] !== undefined) {
      return portfolioClientsGoal[sellerName]
    } else {
      return 0
    }
  }

  const extractCostData = (formattedData, salesGoalBySeller = {}, collectionGoalBySeller = {}, portfolioClientsGoals = {}) => {
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
    let portfolioClientsGoal

    let inventoryTurnoverGoal
    const salesByInventoryTurnover = {}
    let totalSalesInventoryTurnover = 0

    let totalWithFreight
    let margin
    let percentageMargin

    let collectionTarget

    let splitChain

    let commission

    const motorlightsObject = {
      cantidadFacturas: 0,
      metaRecaudoSinIva: getSalesGoal('MOTORLIGHTS S.A.S', salesGoalBySeller),
      metaVentas: getGoalCollection('MOTORLIGHTS S.A.S', collectionGoalBySeller),
      metaClientesDePortafolio: getPortfolioClientsGoals('MOTORLIGHTS S.A.S', portfolioClientsGoals),
      porcentajeRecaudo: 0,
      porcentajeVentas: 0,
      metaRotacionDeInventario: 0,
      ventasRotacionDeInventario: [],
      totalVentasRotacionDeInventario: 0,
      promedioVentas: 0,
      recaudoPendiente: 0,
      totalRecaudo: 0,
      totalVenta: 0,
      vendedor: 'MOTORLIGHTS S.A.S',
      ventasPendiente: 0,
      comisionTotal: 0,
      margen: 0,
      porcentajeMargen: 0,
      clientesNuevos: []
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

            pendingCollectionTarget = collectionGoalBySeller[currentSeller] || 0

            portfolioClientsGoal = portfolioClientsGoals[currentSeller] || 0

            inventoryTurnoverGoal = salesGoalBySeller[currentSeller] * 0.03

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

            const processedSalesData = sellerSales.map(sales => {
              const { doc, codigoInventario, ...restOfData } = sales
              const productId = extractIdNumber(codigoInventario)
              const product = extractText(codigoInventario)
              return {
                ...restOfData,
                doc: removeExtraSpaces(doc),
                idProducto: productId,
                producto: product
              }
            })

            saleData[currentSeller] = processedSalesData

            salesByInventoryTurnover[currentSeller] = {}

            saleData[currentSeller].forEach(({ idProducto, producto, ventas }) => {
              inventoryTurnover.forEach(({ codigo, nombre }) => {
                if (idProducto === Number(codigo)) {
                  totalSalesInventoryTurnover += ventas
                  if (!salesByInventoryTurnover[currentSeller][Number(codigo)]) {
                    salesByInventoryTurnover[currentSeller][Number(codigo)] = {
                      producto,
                      codigo,
                      totalDeVenta: 0
                    }
                  }
                  salesByInventoryTurnover[currentSeller][Number(codigo)].totalDeVenta += Number(ventas) || 0
                }
              })
            })

            sale.push(
              {
                cantidadFacturas: billCounter,
                comisionTotal: 0,
                comisionVenta: commission,
                margen: margin,
                metaRecaudoSinIva: collectionTarget,
                metaVentas: goalSale,
                metaClientesDePortafolio: portfolioClientsGoal,
                porcentajeMargen: percentageMargin,
                porcentajeRecaudo: 0,
                porcentajeVentas: percetageSale,
                metaRotacionDeInventario: inventoryTurnoverGoal,
                ventasRotacionDeInventario: salesByInventoryTurnover[currentSeller],
                totalVentasRotacionDeInventario: totalSalesInventoryTurnover,
                promedioVentas: averageSale,
                recaudoPendiente: pendingCollectionTarget,
                totalCosto: totalCost,
                totalRecaudo: 0,
                totalVenta: total,
                vendedor: currentSeller,
                venta: saleData[currentSeller],
                ventasPendiente: pendingSalesTarget,
                clientesNuevos: []
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
      if (currentSeller && sellerSales && splitChain !== undefined && !splitChain[1].startsWith('Flete')) {
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
      const sellerSales = sale.map(({ vendedor }) => vendedor)
      const filter = sellers.filter(({ identificacion }) => !sellerSales.includes(identificacion))
      filter.map(el => {
        const { identificacion } = el
        return sale.push({
          cantidadFacturas: 0,
          metaVentas: getSalesGoal(identificacion, salesGoalBySeller),
          metaRecaudoSinIva: getGoalCollection(identificacion, collectionGoalBySeller),
          metaClientesDePortafolio: getPortfolioClientsGoals(identificacion, portfolioClientsGoals),
          porcentajeRecaudo: 0,
          porcentajeVentas: 0,
          metaRotacionDeInventario: 0,
          promedioVentas: 0,
          recaudoPendiente: 0,
          totalRecaudo: 0,
          totalVenta: 0,
          totalVentasRotacionDeInventario: 0,
          vendedor: identificacion,
          ventasPendiente: 0,
          comisionTotal: 0,
          margen: 0,
          porcentajeMargen: 0,
          clientesNuevos: []
        })
      })

      const foundMotorlights = sale.find(el => el.vendedor === 'MOTORLIGHTS S.A.S')
      if (foundMotorlights === undefined) {
        sale.push(motorlightsObject)
      }
    }
    setData(sale)
  }

  useEffect(() => {
    extractCostData(formattedDataCost, salesGoalBySeller, collectionGoalBySeller, portfolioClientsGoals)
    setCostReportName(reportName)
    setDateCostFile(reportDate)
  }, [excelDataCost, salesGoalBySeller, collectionGoalBySeller, portfolioClientsGoals, sellers])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadCostFile} />
    </>
  )
}

export default InputCostFile
