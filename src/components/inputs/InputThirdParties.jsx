import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { thirdPartiesFileToModel } from '../../mappers'
import { ThirdPartiesContext } from '../../context/thirdParties'
import { ReportDetailsContext } from '../../context/reportDetails'
import { DataExcelContext } from '../../context/dataExcel'

const InputThirdParties = ({ label, department }) => {
  const { excelDataThirdParties, setExcelDataThirdParties } = useContext(DataExcelContext)
  const { setThirdPartiesData, thirdPartiesData, setCustomerData } = useContext(ThirdPartiesContext)
  const { setThirdPartiesReportName } = useContext(ReportDetailsContext)

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
  const reportName = excelDataThirdParties[1]

  const reportHeaders = excelDataThirdParties[2]
  const reportRows = excelDataThirdParties.slice(3)
  const formattedDataThirdParties = formatDataThirdParties(reportHeaders, reportRows)

  const extractThirdPartiesData = (formattedDataThirdParties = []) => {
    const thirdPartiesData = formattedDataThirdParties
    setThirdPartiesData(thirdPartiesData)
  }

  const extractUniqueThirdParties = (dataThirdParties = [], dataDepartment = []) => {
    const uniqueCustomers = []
    const uniqueCustomerNames = new Set()

    dataThirdParties.forEach(customer => {
      if (!uniqueCustomerNames.has(customer.nombre)) {
        uniqueCustomerNames.add(customer.nombre)
        uniqueCustomers.push(customer)
      }
    })

    const uniqueCustomersWithDepartment = uniqueCustomers.map(cliente => {
      const municipality = dataDepartment.find(depart => (
        depart.municipios.some(munic => munic.nombre === cliente.ciudad)
      ))
      const department = municipality ? municipality.nombre : 'n/a'
      const { ciudad, direccion, telefonos, ...restOfData } = cliente
      return {
        ...restOfData,
        departamento: department,
        ciudad: ciudad || 'n/a',
        direccion: direccion || 'n/a',
        telefonos: telefonos || 'n/a'
      }
    })

    setCustomerData(uniqueCustomersWithDepartment)
  }

  useEffect(() => {
    extractThirdPartiesData(formattedDataThirdParties)
    setThirdPartiesReportName(reportName)
  }, [excelDataThirdParties])

  useEffect(() => {
    extractUniqueThirdParties(thirdPartiesData, department)
  }, [thirdPartiesData])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadThirdParties} />
    </>
  )
}

export default InputThirdParties
