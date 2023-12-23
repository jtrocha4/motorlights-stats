import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { productFileToModel } from '../../mappers/product.mapper'

const InputProduct = ({ label, postProductToApi, removeExtraSpaces }) => {
  const [inventory, setInventory] = useState([])

  const handleReadProducts = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setInventory(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatInventory = (headers = [], rows = []) => {
    const inventoryFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = row[index]
      })
      return rowData
    })
    return productFileToModel(inventoryFile)
  }

  const headersInventoryFile = inventory[3]
  const rowsInventoryFile = inventory.slice(6)
  const formattedInventory = formatInventory(headersInventoryFile, rowsInventoryFile)

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

  const categorizedInventory = formattedInventory
    .filter(el => el.codigoInventario !== undefined && el.descripcion !== undefined)
    .map(el => {
      const category = productCategory(el.descripcion)
      return {
        ...el,
        categoria: category
      }
    })

  const leakedData = []

  categorizedInventory.forEach(el => {
    const { categoria, codigoInventario, descripcion } = el
    leakedData.push({
      categoria,
      codigo: codigoInventario,
      nombre: removeExtraSpaces(descripcion)
    })
  })

  const handleUpload = async () => {
    try {
      for (const key in leakedData) {
        await postProductToApi(leakedData[key])
      }
      console.log('Productos cargados con exito')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadProducts} />
      <button className='btn btn-primary mt-2' onClick={handleUpload}>Subir</button>
    </>
  )
}

export default InputProduct
