import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { DataExcelContext } from '../../context/dataExcel'
import { creditAndPortfolioFileToModel } from '../../mappers/creditAndPortfolioFile.mapper'
import { DataContext } from '../../context/data'

const InputCreditAndPortfolio = ({ label, convertExcelDateToReadable }) => {
  const { excelDataCreditAndPortfolio, setExcelDataCreditAndPortfolio } = useContext(DataExcelContext)
  const { dataPortfolio, setDataPortfolio, dataCollection, setPortfolioBehavior } = useContext(DataContext)

  const handlePortfolioFile = (event) => {
    const file = event.target.files[0]
    // eslint-disable-next-line no-undef
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelDataCreditAndPortfolio(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatPortfolioFile = (headers = [], rows = []) => {
    const portfolioFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = row[index]
      })
      return rowData
    })
    return creditAndPortfolioFileToModel(portfolioFile)
  }

  const reportHeaders = excelDataCreditAndPortfolio[2]
  const reportRows = excelDataCreditAndPortfolio.slice(3)
  const formattedDataPortfolio = formatPortfolioFile(reportHeaders, reportRows)

  const formatterDoc = (doc) => {
    const document = doc.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()
    if (document.startsWith('NCCL')) {
      const split = document.split(' ')
      const docNumber = split.length - 1
      return `NCCL NCE ${split[docNumber]}`
    }
    if (document.startsWith('DMC')) {
      const split = document.split(' ')
      const docNumber = split.length - 1
      return `DMC DMCE ${split[docNumber]}`
    }
    return document
  }

  const getMonth = (date) => {
    const months = {
      0: 'Enero',
      1: 'Febrero',
      2: 'Marzo',
      3: 'Abril',
      4: 'Mayo',
      5: 'Junio',
      6: 'Julio',
      7: 'Agosto',
      8: 'Septiembre',
      9: 'Octubre',
      10: 'Noviembre',
      11: 'Diciembre'
    }

    const newDate = new Date(date)
    return months[newDate.getMonth()]
  }

  const getYear = (date) => {
    const newDate = new Date(date)
    return newDate.getFullYear()
  }

  const extractPortfolioData = (formattedData = []) => {
    let currentSeller
    const portfolioData = {}
    const sellerPortfolio = []

    formattedData.forEach(row => {
      if (row.vendedor) {
        if (row.vendedor.startsWith('Total')) {
          if (currentSeller) {
            portfolioData[currentSeller] = portfolioData[currentSeller].filter(el => {
              const docType = formatterDoc(el.doc).split(' ')[0].toUpperCase()
              return docType === 'FV' || docType === 'NCCL' || docType === 'DMC'
            }).map(el => {
              const { doc, direccion, ...restOfData } = el
              return {
                ...restOfData,
                direccion: direccion.replace(/\s+/g, ' ').trim(),
                doc: formatterDoc(doc)
              }
            })

            sellerPortfolio.push({
              vendedor: currentSeller,
              cartera: portfolioData[currentSeller] || []
            })
          }
          currentSeller = null
        } else {
          currentSeller = row.vendedor
          portfolioData[currentSeller] = portfolioData[currentSeller] || []
        }
      }
      if (currentSeller) {
        if (row.vendedor) {
          portfolioData[currentSeller].push(row)
        }
      }
    })
    setDataPortfolio(sellerPortfolio)
  }

  const differenceInDays = (startDate, endDate) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const difference = end - start
    return difference / (1000 * 60 * 60 * 24)
  }

  const portfolioBehaviorAnalysis = (dataPortfolio = [], dataCollection = []) => {
    const portfolio = Object.values(dataPortfolio).map(({ cartera }) => cartera).flat()
    const collection = Object.values(dataCollection).map(({ recaudo }) => recaudo).flat()

    const behavior = []
    const iva = 1.19

    portfolio.forEach(element => {
      const matchingCollection = collection.find(el => element.doc === el.factura)
      if (matchingCollection) {
        const expirationDate = convertExcelDateToReadable(element.fechaVencimiento)
        const paymentDate = convertExcelDateToReadable(matchingCollection.fecha)
        const goal = parseFloat(element.totalMes / iva)
        const difference = parseFloat(element.totalMes - matchingCollection.recaudo)
        behavior.push({
          anio: getYear(expirationDate),
          cliente: element.cliente,
          diasEnPagar: (difference === 0) ? (differenceInDays(expirationDate, paymentDate)) : (0),
          diasSinPagar: (difference !== 0) ? (differenceInDays(expirationDate, paymentDate)) : (0),
          diferencia: difference || 0,
          direccion: element.direccion,
          doc: element.doc,
          empresa: element.empresa,
          fechaDePago: paymentDate,
          fechaVencimiento: expirationDate,
          mes: getMonth(expirationDate),
          meta: goal,
          totalMes: element.totalMes,
          valorPago: matchingCollection.recaudo,
          vendedor: element.vendedor
        })
      }
    })
    setPortfolioBehavior(behavior)
  }

  useEffect(() => {
    extractPortfolioData(formattedDataPortfolio)
  }, [excelDataCreditAndPortfolio])

  useEffect(() => {
    portfolioBehaviorAnalysis(dataPortfolio, dataCollection)
  }, [dataPortfolio])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handlePortfolioFile} />
    </>
  )
}

export default InputCreditAndPortfolio
