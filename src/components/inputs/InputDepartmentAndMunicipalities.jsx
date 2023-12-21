import React, { useState } from 'react'
import { departAndMunicFileToModel } from '../../mappers'
import * as XLSX from 'xlsx'

const InputDepartmentAndMunicipalities = ({ label, capitalizeWords, removeExtraSpaces, department, postMunicipalityToApi }) => {
  const [excelDeptAndMunic, setExcelDeptAndMunic] = useState([])

  const handleReadDepartmentAndMunicipalities = (event) => {
    const file = event.target.files[0]
    // eslint-disable-next-line no-undef
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelDeptAndMunic(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatDataDeptAndMunic = (headers = [], rows = []) => {
    const deptAndMunicFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = row[index]
      })
      return rowData
    })
    return departAndMunicFileToModel(deptAndMunicFile)
  }

  const headersDeptAndMunic = excelDeptAndMunic[0]
  const rowsDeptAndMunic = excelDeptAndMunic.slice(1)
  const formattedDataDeptAndMunic = formatDataDeptAndMunic(headersDeptAndMunic, rowsDeptAndMunic)

  const leakedData = []

  formattedDataDeptAndMunic.forEach(el => {
    const { municipio, departamento } = el

    department.forEach(dept => {
      if (dept.nombre === removeExtraSpaces(capitalizeWords(departamento))) {
        leakedData.push({
          nombre: removeExtraSpaces(capitalizeWords(municipio)),
          idDepartamento: dept.id
        })
      }
    })
  })

  const handleUpload = async () => {
    try {
      for (const key in leakedData) {
        await postMunicipalityToApi(leakedData[key])
      }
      console.log('Papi todo good good')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadDepartmentAndMunicipalities} />
      <button type='button' className='btn btn-primary' onClick={handleUpload}>Subir</button>
    </>
  )
}

export default InputDepartmentAndMunicipalities
