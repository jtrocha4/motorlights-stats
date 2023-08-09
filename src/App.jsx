import './App.css'
import * as XLSX from 'xlsx'
import InputFile from './components/InputFile'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { useEffect, useState } from 'react'
import Table from './components/Table'

function App () {
  const [excelData, setExcelData] = useState([])
  const [data, setData] = useState([])

  const handleFileRead = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelData(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatData = (headers = [], rows = []) => {
    return rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        // Filtrado de columnas, las columnas que estan dentro de la condicion no aparecen
        if (header !== 'Ventas' && header !== 'Total Costo' && header !== 'PorMargen' && header !== 'Costo Unitario' && header !== 'Margen') {
          rowData[header] = row[index]
        }
      })
      // Calculo de columnas Ventas
      const units = parseInt(row[headers.indexOf('Unidades')])
      const unitSale = parseFloat(row[headers.indexOf('Unitario Venta')])
      rowData.Ventas = parseFloat((units * unitSale).toFixed(2))
      return rowData
    })
  }

  // Todo: tal vez guardar los datos formateados dentro de un hooks
  const headers = excelData[3]
  const rows = excelData.slice(4)
  const formattedData = formatData(headers, rows)

  const howAreYouDoing = (formattedData) => {
    const sellerData = []
    const totalSales = []
    let currentSeller
    let sellerSales
    let total
    const uniqueDocs = {}
    let billCounter
    let averageSale

    // Meta de ventas de cada trabajador
    const seller = {
      'CARLOS ALONSO VESGA ORTIZ': 85000000,
      'DEIVER JOSE ZUÑIGA VASQUEZ': 35000000,
      'HERNANDO JAVIER NOVA NARVAEZ': 70000000,
      'JOSE ANDRES MONTENEGRO GUEVARA': 30000000,
      'MARIA VICTORIA MOLINA': 50000000,
      'MELANY JOHANNA RAMIREZ QUINTERO': 30000000,
      'SERGIO ANDRES BARCELO TRESPALACIOS': 65000000
    }
    let goalSale
    let percetageSale
    let pendingSalesTarget

    formattedData.forEach(row => {
      if (row.Vendedor) {
        if (row.Vendedor.startsWith('Total')) {
          if (currentSeller) {
            // Calculo de operaciones
            billCounter = Object.keys(uniqueDocs[currentSeller] || {}).length
            averageSale = total / Object.keys(uniqueDocs[currentSeller] || {}).length
            goalSale = seller[currentSeller]
            percetageSale = (total * 100) / goalSale
            pendingSalesTarget = goalSale - total

            // Aproximacion de los datos
            averageSale = toFixed(averageSale, 2)
            percetageSale = toFixed(percetageSale, 1)
            pendingSalesTarget = toFixed(pendingSalesTarget, 2)

            sellerData.push({ vendedor: currentSeller, productosVendidos: [sellerSales] })
            totalSales.push({ vendedor: currentSeller, ventasTotales: total, cantidadFacturas: billCounter, promedioVentas: averageSale, metaVentas: goalSale, porcentajeVentas: percetageSale, metaVentasPendiente: pendingSalesTarget })
          }
          currentSeller = null
          sellerSales = null
          total = 0
        } else {
          currentSeller = row.Vendedor
          sellerSales = []
          total = 0
        }
      }
      if (currentSeller && sellerSales) {
        sellerSales.push(row)
        total += row.Ventas || 0
        if (!uniqueDocs[currentSeller]) {
          uniqueDocs[currentSeller] = {}
        }
        uniqueDocs[currentSeller][row.Doc] = true
      }
    })
    setData(totalSales)
  }

  useEffect(() => {
    howAreYouDoing(formattedData)
  }, [excelData])

  const currencyFormat = (number) => {
    return number.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
  }

  const toFixed = (number, digitAfterPoint) => {
    return parseFloat(number.toFixed(digitAfterPoint))
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className='flex'>
        <div className='container'>
          <h2>Inicio</h2>
          <p>Añada los siguientes archivos:</p>
          <div className='inputFile-group'>
            <InputFile label='Informe de Costo' handleChange={handleFileRead} />
            <InputFile label='Informe de Recaudo' handleChange={handleFileRead} />
          </div>
          <div>
            <h2>Como vamos</h2>
            <Table headers={['Vendedor', 'Total ventas', 'Cantidad de facturas', 'Promedio de ventas', 'Meta de ventas', 'Porcentaje de ventas', 'Ventas pendiente', 'Recaudo', 'Meta recaudo sin iva', 'Porcentaje de recaudo', 'Recaudo pendiente']} data={data} currencyFormat={currencyFormat} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
