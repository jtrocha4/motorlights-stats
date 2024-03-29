import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { auxiliaryBookFileToModel } from '../../mappers'
import { DataContext } from '../../context/data'
import { ReportDetailsContext } from '../../context/reportDetails'
import { DataExcelContext } from '../../context/dataExcel'

const InputAuxiliaryBookFile = ({ label, salesGoalBySeller, collectionGoalBySeller, extractDate }) => {
  const { setDataAuxiliaryBook, setTotalDebitByDocNum } = useContext(DataContext)
  const { excelDataAuxiliaryBook, setExcelDataAuxiliaryBook } = useContext(DataExcelContext)

  const { setAuxiliaryBookReportName, setDateAuxiliaryBookFile } = useContext(ReportDetailsContext)

  const handleReadAuxiliaryBookFile = (event) => {
    const file = event.target.files[0]
    // eslint-disable-next-line no-undef
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelDataAuxiliaryBook(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatDataAuxiliaryBookFile = (headers = [], rows = []) => {
    const auxiliaryBookFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        if (header !== 'Creditos' && header !== 'Cheque' && header !== 'Tercero' && header !== 'Saldo' && header !== 'Nota') {
          rowData[header] = row[index]
        }
      })
      return rowData
    })
    return auxiliaryBookFileToModel(auxiliaryBookFile)
  }

  const reportName = excelDataAuxiliaryBook[1]
  const reportDate = extractDate(excelDataAuxiliaryBook[1]) || []

  const reportHeaders = excelDataAuxiliaryBook[3]
  const reportRows = excelDataAuxiliaryBook.slice(4)
  const formattedDataAuxiliaryBookFile = formatDataAuxiliaryBookFile(reportHeaders, reportRows)

  const extractAuxiliaryBookData = async (formattedDataAuxiliaryBookFile) => {
    const sellerCollection = []
    let currentSeller
    let sellerSales

    formattedDataAuxiliaryBookFile.forEach(row => {
      if (row.cuenta) {
        if (row.cuenta.startsWith('Total')) {
          if (currentSeller) {
            const filterDoc = sellerSales.filter(el => el.docNum !== undefined)
            filterDoc.forEach(el => {
              const numberDoc = el.docNum.match(/\d+/g).join('')
              el.docNum = numberDoc
            })
            sellerCollection.push(filterDoc)
          }
          currentSeller = null
          sellerSales = null
        } else {
          currentSeller = row.cuenta
          sellerSales = []
        }
      }
      if (currentSeller && sellerSales) {
        sellerSales.push(row)
      }
    })
    const sellerCollectionFilter = sellerCollection.filter(el => el.length > 0)
    const debitForDocNum = {}
    sellerCollectionFilter.forEach(collection => {
      collection.forEach(el => {
        const docNum = el.docNum
        const debit = parseFloat(el.debitos)
        if (debitForDocNum[docNum]) {
          debitForDocNum[docNum] += debit
        } else {
          debitForDocNum[docNum] = debit
        }
      })
    })

    setTotalDebitByDocNum(debitForDocNum)
    setDataAuxiliaryBook(sellerCollectionFilter)
  }

  useEffect(() => {
    extractAuxiliaryBookData(formattedDataAuxiliaryBookFile)
    setAuxiliaryBookReportName(reportName)
    setDateAuxiliaryBookFile(reportDate)
  }, [excelDataAuxiliaryBook, salesGoalBySeller, collectionGoalBySeller])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadAuxiliaryBookFile} />
    </>
  )
}

export default InputAuxiliaryBookFile
