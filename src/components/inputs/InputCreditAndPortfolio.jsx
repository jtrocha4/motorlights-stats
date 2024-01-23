import React, { useContext } from 'react'
import * as XLSX from 'xlsx'
import { DataExcelContext } from '../../context/dataExcel'
import { creditAndPortfolioFileToModel } from '../../mappers/creditAndPortfolioFile.mapper'

const InputCreditAndPortfolio = ({ label }) => {
  const { excelDataCreditAndPortfolio, setExcelDataCreditAndPortfolio } = useContext(DataExcelContext)

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

  console.log(formattedDataPortfolio)

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handlePortfolioFile} />
    </>
  )
}

export default InputCreditAndPortfolio
