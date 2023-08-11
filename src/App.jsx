import './App.css'
import * as XLSX from 'xlsx'
import InputFile from './components/InputFile'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { useEffect, useState } from 'react'
import Table from './components/Table'
import ModalGoals from './components/ModalGoals'

function App () {
  const [excelData, setExcelData] = useState([])
  const [data, setData] = useState([])
  const [dataCollection, setDataCollection] = useState([])

  // Data informe de recaudo
  const [excelDataCollection, setExcelDataCollection] = useState([])

  const currencyFormat = (number) => {
    if (number) {
      return number.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    } else {
      return number
    }
  }

  const toFixed = (number, digitAfterPoint) => {
    return parseFloat(number.toFixed(digitAfterPoint))
  }

  const handleReadCostFile = (event) => {
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

  const handleReadCollectionFile = (event) => {
    const file = event.target.files[0]
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

  const formatDataCollectionFile = (headers = [], rows = []) => {
    return rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        if (header !== 'Sucursal' && header !== 'Empresa') {
          rowData[header] = row[index]
        }
      })
      return rowData
    })
  }

  // Todo: tal vez guardar los datos formateados dentro de un hooks
  const headers = excelData[3]
  const rows = excelData.slice(4)
  const formattedData = formatData(headers, rows)

  const headersCollectionFile = excelDataCollection[2]
  const rowsCollectionFile = excelDataCollection.slice(3)
  const formattedDataCollectionFile = formatDataCollectionFile(headersCollectionFile, rowsCollectionFile)

  const howAreYouDoing = (formattedData) => {
    const sellerData = []
    const totalSales = []
    let currentSeller
    let sellerSales
    let total
    const uniqueDocs = {}
    let billCounter
    let averageSale

    // Meta de ventas de cada vendedor
    // const SalesGoalBySeller = {
    //   'CARLOS ALONSO VESGA ORTIZ': 85000000,
    //   'DEIVER JOSE ZUÑIGA VASQUEZ': 35000000,
    //   'HERNANDO JAVIER NOVA NARVAEZ': 70000000,
    //   'JOSE ANDRES MONTENEGRO GUEVARA': 30000000,
    //   'MARIA VICTORIA MOLINA': 50000000,
    //   'MELANY JOHANNA RAMIREZ QUINTERO': 30000000,
    //   'SERGIO ANDRES BARCELO TRESPALACIOS': 65000000,
    //   'MOTORLIGHTS S.A.S': 0
    // }

    // Mes Julio
    const SalesGoalBySeller = {
      'CARLOS ALONSO VESGA ORTIZ': 85000000,
      'HERNANDO JAVIER NOVA NARVAEZ': 70000000,
      'JOSE ANDRES MONTENEGRO GUEVARA': 35000000,
      'JULIAN ANDRES POSADA SALAZAR': 30000000,
      'MARIA VICTORIA MOLINA': 50000000,
      'MELANY JOHANNA RAMIREZ QUINTERO': 30000000,
      'SERGIO ANDRES BARCELO TRESPALACIOS': 65000000,
      'MOTORLIGHTS S.A.S': 0
    }
    let goalSale
    let percetageSale
    let pendingSalesTarget
    let pendingCollectionTarget

    // Meta de recaudo sin iva de cada vendedor
    // const collectionGoalBySeller = {
    //   'CARLOS ALONSO VESGA ORTIZ': 81790197,
    //   'DEIVER JOSE ZUÑIGA VASQUEZ': 46092816,
    //   'HERNANDO JAVIER NOVA NARVAEZ': 73101897,
    //   'JOSE ANDRES MONTENEGRO GUEVARA': 14660847,
    //   'MARIA VICTORIA MOLINA': 42858353,
    //   'MELANY JOHANNA RAMIREZ QUINTERO': 27524761,
    //   'SERGIO ANDRES BARCELO TRESPALACIOS': 46036555,
    //   'MOTORLIGHTS S.A.S': 0
    // }

    // Mes Julio
    const collectionGoalBySeller = {
      'CARLOS ALONSO VESGA ORTIZ': 92652788,
      'HERNANDO JAVIER NOVA NARVAEZ': 53992361,
      'JOSE ANDRES MONTENEGRO GUEVARA': 31465638,
      'JULIAN ANDRES POSADA SALAZAR': 12501019,
      'MARIA VICTORIA MOLINA': 39531092,
      'MELANY JOHANNA RAMIREZ QUINTERO': 33454267,
      'SERGIO ANDRES BARCELO TRESPALACIOS': 37009536,
      'MOTORLIGHTS S.A.S': 47043982
    }
    let collectionTarget
    let percentageCollected

    formattedData.forEach(row => {
      if (row.Vendedor) {
        if (row.Vendedor.startsWith('Total')) {
          if (currentSeller) {
            // Calculo de operaciones
            billCounter = Object.keys(uniqueDocs[currentSeller] || {}).length
            averageSale = total / Object.keys(uniqueDocs[currentSeller] || {}).length
            goalSale = SalesGoalBySeller[currentSeller]
            percetageSale = (total * 100) / goalSale
            pendingSalesTarget = goalSale - total

            collectionTarget = collectionGoalBySeller[currentSeller]
            percentageCollected = 100
            pendingCollectionTarget = collectionGoalBySeller[currentSeller]

            // Aproximacion de los datos
            averageSale = toFixed(averageSale, 2)
            percetageSale = toFixed(percetageSale, 1)
            pendingSalesTarget = toFixed(pendingSalesTarget, 2)

            sellerData.push({ vendedor: currentSeller, productosVendidos: [sellerSales] })
            totalSales.push(
              {
                vendedor: currentSeller,
                totalVenta: total,
                cantidadFacturas: billCounter,
                promedioVentas: averageSale,
                metaVentas: goalSale,
                porcentajeVentas: percetageSale,
                metaVentasPendiente: pendingSalesTarget,
                totalRecaudo: 0,
                metaRecaudoSinIva: collectionTarget,
                porcentajeRecaudo: percentageCollected,
                recaudoPendiente: pendingCollectionTarget
              }
            )
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

  const howAreYouDoingCollection = (formattedData) => {
    const totalCollection = []
    let sellerCollection = []
    let currentSeller
    let total

    // const collectionGoalBySeller = {
    //   'CARLOS ALONSO VESGA ORTIZ': 81790197,
    //   'DEIVER JOSE ZUÑIGA VASQUEZ': 46092816,
    //   'HERNANDO JAVIER NOVA NARVAEZ': 73101897,
    //   'JOSE ANDRES MONTENEGRO GUEVARA': 14660847,
    //   'MARIA VICTORIA MOLINA': 42858353,
    //   'MELANY JOHANNA RAMIREZ QUINTERO': 27524761,
    //   'SERGIO ANDRES BARCELO TRESPALACIOS': 46036555,
    //   'MOTORLIGHTS S.A.S': 0
    // }
    const collectionGoalBySeller = {
      'CARLOS ALONSO VESGA ORTIZ': 92652788,
      'HERNANDO JAVIER NOVA NARVAEZ': 53992361,
      'JOSE ANDRES MONTENEGRO GUEVARA': 31465638,
      'JULIAN ANDRES POSADA SALAZAR': 12501019,
      'MARIA VICTORIA MOLINA': 39531092,
      'MELANY JOHANNA RAMIREZ QUINTERO': 33454267,
      'SERGIO ANDRES BARCELO TRESPALACIOS': 37009536,
      'MOTORLIGHTS S.A.S': 47043982
    }
    let collectionTarget
    let percentageCollected
    let pendingCollectionTarget

    formattedData.forEach(row => {
      if (row.Vendedor) {
        if (row.Vendedor.startsWith('Total')) {
          if (currentSeller) {
            // Calculo de operaciones
            collectionTarget = collectionGoalBySeller[currentSeller]
            percentageCollected = (total * 100) / collectionTarget
            pendingCollectionTarget = collectionTarget - total

            // Aproximacion de los datos
            percentageCollected = toFixed(percentageCollected, 1)

            sellerCollection.push({ vendedor: currentSeller, recaudo: [sellerCollection] })
            totalCollection.push(
              {
                vendedor: currentSeller,
                totalRecaudo: total,
                metaRecaudoSinIva: 0,
                porcentajeRecaudo: percentageCollected,
                recaudoPendiente: pendingCollectionTarget
              }
            )
          }
          sellerCollection = null
          currentSeller = null
          total = 0
        } else {
          currentSeller = row.Vendedor
          sellerCollection = []
          total = 0
        }
      }
      if (currentSeller && sellerCollection) {
        sellerCollection.push(row)
        total += row.Recaudo || 0
      }
    })
    setDataCollection(totalCollection)
  }

  const joinData = (dataCollection = [], dataCost = []) => {
    const collectionBySeller = []
    dataCollection.forEach(({ vendedor, totalRecaudo, metaRecaudoSinIva, porcentajeRecaudo, recaudoPendiente }) => {
      collectionBySeller.push({ vendedor, totalRecaudo, metaRecaudoSinIva, porcentajeRecaudo, recaudoPendiente })
    })
    dataCost.forEach(el => {
      const combinedData = collectionBySeller.find(element => element.vendedor === el.vendedor)
      if (combinedData) {
        el.totalRecaudo = combinedData.totalRecaudo
        el.porcentajeRecaudo = combinedData.porcentajeRecaudo
        el.recaudoPendiente = combinedData.recaudoPendiente
      }
    })
  }

  joinData(dataCollection, data)

  useEffect(() => {
    howAreYouDoing(formattedData)
    howAreYouDoingCollection(formattedDataCollectionFile)
  }, [excelData, excelDataCollection])

  const sendForm = (formData) => {
    console.log(formData)
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
            <InputFile label='Informe de Costo' handleChange={handleReadCostFile} />
            <InputFile label='Informe de Recaudo' handleChange={handleReadCollectionFile} />
            <div className='button-group'>
              <ModalGoals title='Modificar metas' data={data} sendForm={sendForm} />
            </div>
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
