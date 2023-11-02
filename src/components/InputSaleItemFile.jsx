import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { saleItemFileToModel } from '../mappers'
import { SaleItemContext } from './context/saleItem'
import { ReportDetailsContext } from './context/reportDetails'
import { ThirdPartiesContext } from './context/thirdParties'

const InputSaleItemFile = ({ label, convertExcelDateToReadable, extractIdNumber, extractText, capitalizeWords, removeExtraSpaces }) => {
  const { excelDataSaleItem, setExcelDataSaleItem, setSellersCustomers, setDataSaleItem, dataSaleItem, setSellerSalesData } = useContext(SaleItemContext)
  const { setSalesItemsReportName } = useContext(ReportDetailsContext)

  const { customerData } = useContext(ThirdPartiesContext)

  const handleReadSaleItemFile = (event) => {
    const file = event.target.files[0]
    // eslint-disable-next-line no-undef
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelDataSaleItem(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatDataSaleItemFile = (headers = [], rows = []) => {
    const saleItemFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = row[index]
      })
      return rowData
    })
    return saleItemFileToModel(saleItemFile)
  }

  // const reportDate = excelDataSaleItem[1]
  const reportName = excelDataSaleItem[1]

  const reportHeaders = excelDataSaleItem[3]
  const reportRows = excelDataSaleItem.slice(4)
  const formattedDataSaleItem = formatDataSaleItemFile(reportHeaders, reportRows)

  const extractCustomersFromSeller = (formattedData) => {
    let currentSeller
    let customers = []

    const seller = []

    formattedData.forEach(row => {
      if (row.vendedor) {
        if (row.vendedor.startsWith('Total')) {
          if (currentSeller) {
            const uniqueCustomers = [...new Set(customers)]
            seller.push({
              vendedor: currentSeller,
              clientes: uniqueCustomers
            })
            currentSeller = null
            customers = []
          }
        } else {
          currentSeller = row.vendedor
        }
      }
      if (currentSeller && customers) {
        customers.push(row.cliente)
      }
    })
    setSellersCustomers(seller)
  }

  const extractDataSaleItems = (formattedData) => {
    let currentSeller
    const salesItem = {}
    let soldItems = []

    const dataSalesItems = []

    let splitChain

    formattedData.forEach(row => {
      if (row.descripcion !== undefined) {
        splitChain = row.descripcion.split(' ')
      }
      if (row.vendedor) {
        if (row.vendedor.startsWith('Total')) {
          if (currentSeller) {
            salesItem[currentSeller] = soldItems

            const processedSoldItems = soldItems.map(item => {
              const { doc, ...restOfData } = item
              return {
                ...restOfData,
                doc: removeExtraSpaces(doc)
              }
            })

            salesItem[currentSeller] = processedSoldItems

            dataSalesItems.push({
              vendedor: currentSeller,
              itemsVendidos: salesItem[currentSeller]
            })
            currentSeller = null
            soldItems = []
          }
        } else {
          currentSeller = row.vendedor
        }
      }
      // && !splitChain[1].startsWith('Flete')
      if (currentSeller && soldItems && splitChain !== undefined) {
        soldItems.push(row)
      }
    })
    setDataSaleItem(dataSalesItems)
  }

  const productCategory = (product) => {
    if (product.includes('Alarma')) return 'Alarmas'
    if (product.includes('Bombillo Farola')) return 'Bombillos de Faro'
    if (product.includes('Bombillo Stop') || product.includes('Bombilllo Stop')) return 'Bombillos de Stop'
    if (product.includes('Bombillo Direccional') || product.includes('Direccionales') || product.includes('Bombillo Piloto') || product.includes('Direccional')) return 'Bombillos de Direccional'

    if (product.includes('Bombillo Techo')) return 'Bombillos de Techo'
    if (product.includes('Lagrima')) return 'Lagrimas'
    if (product.includes('Exploradora') || product.includes('Explorador')) return 'Exploradoras'

    if (product.includes('Switche') || product.includes('Terminal') || product.includes('Socket') || product.includes('Fusible') || product.includes('Flasher')) { return 'Electricos' }

    if (product.includes('Protector') || product.includes('Maniguetas')) return 'Protectores'
    if (product.includes('Tornillo')) return 'Tornillos'
    if (product.includes('Modulo Led') || product.includes('Modulo')) return 'Modulos LED'
    if (product.includes('Cinta Led') || product.includes('Modulo') || product.includes('Amarra') || product.includes('Luz Maletero') || product.includes('Ojo')) return 'Otros'
    if (product.includes('Guardabarros')) return 'Guardabarros'
    if (product.includes('Lubricante')) return 'Linea de Mtto'
    if (product.includes('Guardapolvo')) return 'Guardapolvos'

    return 'Sin Categoria'
  }

  const addCategory = (salesData = []) => {
    const categorizedSalesData = salesData.map(el => {
      const category = productCategory(el.producto)
      return {
        ...el,
        categoriaProducto: category
      }
    })
    return categorizedSalesData
  }

  const extractSalesFromData = (dataArray = [], dataThirdParties = []) => {
    const sales = dataThirdParties.flatMap(customer =>
      dataArray.filter(element => element.itemsVendidos !== undefined)
        .map(element =>
          element.itemsVendidos.filter(el => {
            const idCustomer = extractIdNumber(el.cliente)
            return idCustomer === extractIdNumber(customer.id)
          }).map(({ fecha, cliente, descripcion, cantidad, ...restOfData }) => ({
            ...restOfData,
            fecha: convertExcelDateToReadable(fecha),
            cliente: extractText(cliente),
            idCliente: extractIdNumber(cliente),
            ciudadCliente: customer.ciudad,
            departamentoCliente: customer.departamento,
            idProducto: extractIdNumber(descripcion),
            producto: capitalizeWords(extractText(descripcion)),
            unidadesProducto: cantidad
          }))
        )
        .flat()
    )
    const salesWithCategory = addCategory(sales)
    setSellerSalesData(salesWithCategory)
  }

  useEffect(() => {
    extractCustomersFromSeller(formattedDataSaleItem)
    extractDataSaleItems(formattedDataSaleItem)
    setSalesItemsReportName(reportName)
  }, [excelDataSaleItem])

  useEffect(() => {
    extractSalesFromData(dataSaleItem, customerData)
  }, [customerData])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadSaleItemFile} />
    </>
  )
}

export default InputSaleItemFile
