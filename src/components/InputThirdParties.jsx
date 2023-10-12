import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { thirdPartiesFileToModel } from '../mappers'
import { ThirdPartiesContext } from './context/thirdParties'

const InputThirdParties = ({ label }) => {
  const { excelDataThirdParties, setExcelDataThirdParties, setThirdPartiesData } = useContext(ThirdPartiesContext)

  const handleReadThirdParties = (event) => {
    const file = event.target.files[0]
    // eslint-disable-next-line no-undef
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelDataThirdParties(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatDataThirdParties = (headers = [], rows = []) => {
    const thirdPartiesFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = row[index]
      })
      return rowData
    })
    return thirdPartiesFileToModel(thirdPartiesFile)
  }

  //   const dateThirdParties = excelDataThirdParties[1]

  const headersThirdParties = excelDataThirdParties[2]
  const rowsThirdParties = excelDataThirdParties.slice(3)
  const formattedDataThirdParties = formatDataThirdParties(headersThirdParties, rowsThirdParties)

  const extractThirdPartiesData = (formattedDataThirdParties = []) => {
    const thirdPartiesData = formattedDataThirdParties
    setThirdPartiesData(thirdPartiesData)
  }

  useEffect(() => {
    extractThirdPartiesData(formattedDataThirdParties)
  }, [excelDataThirdParties])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadThirdParties} />
    </>
  )
}

export default InputThirdParties
