import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { collectionFileToModel } from '../../mappers'
import { ReportDetailsContext } from '../../context/reportDetails'
import { DataContext } from '../../context/data'
import { DataExcelContext } from '../../context/dataExcel'

const InputCollectionFile = ({ label, toFixed, salesGoalBySeller, collectionGoalBySeller }) => {
  const { totalDebitByDocNum, setDataCollection, setErrorRc } = useContext(DataContext)
  const { setExcelDataCollection, excelDataCollection } = useContext(DataExcelContext)
  const { setCollectionReportName } = useContext(ReportDetailsContext)

  const handleReadCollectionFile = (event) => {
    const file = event.target.files[0]
    // eslint-disable-next-line no-undef
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelDataCollection(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatDataCollectionFile = (headers = [], rows = []) => {
    const collectionFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        if (header !== 'Sucursal' && header !== 'Empresa') {
          rowData[header] = row[index]
        }
      })
      return rowData
    })
    return collectionFileToModel(collectionFile)
  }

  // const reportDate = excelDataCollection[1]
  const reportName = excelDataCollection[1]

  const reportHeaders = excelDataCollection[2]
  const reportRows = excelDataCollection.slice(3)
  const formattedDataCollectionFile = formatDataCollectionFile(reportHeaders, reportRows)

  const extractCollectionData = async (formattedDataCollectionFile, debitForDocNum, collectionGoalBySeller = {}) => {
    const collectionData = {}
    const sellerCollection = []
    let currentSeller
    let sellerSales

    const uniqueRC = {}
    const iva = 1.19
    let total
    let totalWithoutVAT
    let collectionTarget
    let percentageCollected
    let pendingCollectionTarget

    let commission
    let resultBonus

    const errorRc = []

    formattedDataCollectionFile.forEach(row => {
      if (row.rc in debitForDocNum) {
        row.recaudo = debitForDocNum[row.rc]
      } else {
        errorRc.push(`(MS) rc ${row.rc}`)
        row.recaudo = 0
      }
      if (row.vendedor) {
        if (row.vendedor.startsWith('Total')) {
          if (currentSeller) {
            totalWithoutVAT = parseFloat(total / iva)
            collectionTarget = collectionGoalBySeller[currentSeller]

            percentageCollected = (collectionTarget !== 0) ? (((totalWithoutVAT * 100) / collectionTarget)) : (0)

            pendingCollectionTarget = collectionTarget - totalWithoutVAT

            percentageCollected = toFixed(percentageCollected, 1)

            // Comisiones
            let collectionBonus
            const firstBonus = totalWithoutVAT * 0.02

            if (percentageCollected >= 100) {
              collectionBonus = totalWithoutVAT * 0.01
              commission = collectionBonus
            }

            resultBonus = firstBonus

            collectionData[currentSeller] = sellerSales
            sellerCollection.push({
              bonoResultado: resultBonus,
              clientesNuevos: 0,
              comisionRecaudo: commission,
              comisionTotal: 0,
              metaRecaudoSinIva: 0,
              porcentajeRecaudo: percentageCollected,
              recaudo: collectionData[currentSeller],
              recaudoPendiente: pendingCollectionTarget,
              totalRecaudo: totalWithoutVAT,
              vendedor: currentSeller
            })
          }
          currentSeller = null
          sellerSales = null
          total = 0
          commission = 0
          resultBonus = 0
        } else {
          currentSeller = row.vendedor
          sellerSales = []
          total = 0
          commission = 0
          resultBonus = 0
        }
      }
      if (currentSeller && sellerSales) {
        sellerSales.push(row)
        if (!uniqueRC[row.rc]) {
          uniqueRC[row.rc] = row.recaudo
          total += uniqueRC[row.rc]
        }
      }
    })
    setErrorRc(errorRc.filter(el => el !== '(MS) rc undefined'))
    setDataCollection(sellerCollection)
  }

  useEffect(() => {
    extractCollectionData(formattedDataCollectionFile, totalDebitByDocNum, collectionGoalBySeller)
    setCollectionReportName(reportName)
  }, [excelDataCollection, totalDebitByDocNum, salesGoalBySeller, collectionGoalBySeller])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadCollectionFile} />
    </>
  )
}

export default InputCollectionFile
