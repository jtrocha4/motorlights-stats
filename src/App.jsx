import './App.css'
import * as XLSX from 'xlsx'
import InputFile from './components/InputFile'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { useEffect, useState } from 'react'
import Table from './components/Table'
import ModalGoals from './components/ModalGoals'
import ButtonDownloadExcel from './components/ButtonDownloadExcel'

function App () {
  const [excelData, setExcelData] = useState([])
  const [data, setData] = useState([])
  const [dataCollection, setDataCollection] = useState([])
  const [dataAuxiliaryBook, setDataAuxiliaryBook] = useState([])

  // Data informe de recaudo
  const [excelDataCollection, setExcelDataCollection] = useState([])
  const [excelDataAuxiliaryBook, setExcelDataAuxiliaryBook] = useState([])

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
    // eslint-disable-next-line no-undef
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

  const formatData = (headers = [], rows = []) => {
    return rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        // Filtrado de columnas, las columnas que estan dentro de la condicion no aparecen
        if (header !== 'Total Costo' && header !== 'PorMargen' && header !== 'Costo Unitario' && header !== 'Margen') {
          rowData[header] = row[index]
        }
      })
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

  const formatDataAuxiliaryBookFile = (headers = [], rows = []) => {
    return rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        if (header !== 'Creditos' && header !== 'Cheque' && header !== 'Tercero' && header !== 'Saldo' && header !== 'Nota') {
          rowData[header] = row[index]
        }
      })
      return rowData
    })
  }

  // TODO: guardar la fecha de los informes en una variable, siempre se encuentra en la posicion [1] del array
  const headersCostFile = excelData[3]
  const rowsCostFile = excelData.slice(4)
  const formattedData = formatData(headersCostFile, rowsCostFile)

  const headersCollectionFile = excelDataCollection[2]
  const rowsCollectionFile = excelDataCollection.slice(3)
  const formattedDataCollectionFile = formatDataCollectionFile(headersCollectionFile, rowsCollectionFile)

  const headersAuxiliaryBookFile = excelDataAuxiliaryBook[3]
  const rowsAuxiliaryBookFile = excelDataAuxiliaryBook.slice(4)
  const formattedDataAuxiliaryBookFile = formatDataAuxiliaryBookFile(headersAuxiliaryBookFile, rowsAuxiliaryBookFile)

  // console.log(formattedDataAuxiliaryBookFile)
  // console.log(formattedDataCollectionFile)

  const howAreYouDoing = (formattedData, SalesGoalBySeller = {}, collectionGoalBySeller = {}) => {
    const sellerData = []
    const totalSales = []
    let currentSeller
    let sellerSales
    let total
    const uniqueDocs = {}
    let billCounter
    let averageSale

    let goalSale
    let percetageSale
    let pendingSalesTarget
    let pendingCollectionTarget

    let collectionTarget
    let percentageCollected

    formattedData.forEach(row => {
      if (row.Vendedor) {
        if (row.Vendedor.startsWith('Total')) {
          if (currentSeller) {
            // Calculo de operaciones
            billCounter = Object.keys(uniqueDocs[currentSeller] || {}).length
            averageSale = total / Object.keys(uniqueDocs[currentSeller] || {}).length
            goalSale = SalesGoalBySeller[currentSeller] || 0
            percetageSale = (goalSale !== 0) ? ((total * 100) / goalSale) : (0)
            pendingSalesTarget = goalSale - total

            collectionTarget = collectionGoalBySeller[currentSeller] || 0
            percentageCollected = 100
            pendingCollectionTarget = collectionGoalBySeller[currentSeller] || 0

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
                ventasPendiente: pendingSalesTarget,
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

  const howAreYouDoingCollection = (formattedData, collectionGoalBySeller = {}) => {
    const totalCollection = []
    let sellerCollection = []
    let currentSeller
    let total

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

  const howAreYouDoingRecaudo = async (formattedDataCollectionFile) => {
    const sellerData = {}
    const sellerCollection = []
    let currentSeller
    let sellerSales

    formattedDataCollectionFile.forEach(row => {
      if (row.Vendedor) {
        if (row.Vendedor.startsWith('Total')) {
          if (currentSeller) {
            sellerData[currentSeller] = sellerSales
            sellerCollection.push({ vendedor: currentSeller, recaudo: sellerData[currentSeller] })
          }
          currentSeller = null
          sellerSales = null
        } else {
          currentSeller = row.Vendedor
          sellerSales = []
        }
      }
      if (currentSeller && sellerSales) {
        sellerSales.push(row)
      }
    })
    setDataCollection(sellerCollection)
  }

  const howAreYouDoingAuxiliaryBook = async (formattedDataAuxiliaryBookFile) => {
    const sellerCollection = []
    let currentSeller
    let sellerSales
    formattedDataAuxiliaryBookFile.forEach(row => {
      if (row.Cuenta) {
        if (row.Cuenta.startsWith('Total')) {
          if (currentSeller) {
            const filterDoc = sellerSales.filter(el => el['Doc Num'] !== undefined)
            filterDoc.forEach(el => {
              const numberDoc = el['Doc Num'].match(/\d+/g).join('')
              el['Doc Num'] = numberDoc
            })
            sellerCollection.push(filterDoc)
          }
          currentSeller = null
          sellerSales = null
        } else {
          currentSeller = row.Cuenta
          sellerSales = []
        }
      }
      if (currentSeller && sellerSales) {
        sellerSales.push(row)
      }
    })
    const sellerCollectionFilter = sellerCollection.filter(el => el.length > 0)
    setDataAuxiliaryBook(sellerCollectionFilter)
  }
  dataCollection.forEach(element => {
    const recaudo = element.recaudo
    const debitosPorDocNum = {}
    recaudo.forEach(it => {
      dataAuxiliaryBook.forEach(item => {
        item.forEach(el => {
          const docNum = el['Doc Num']
          console.log(docNum)
          console.log(debitosPorDocNum[docNum])
        })
      })
    })
    console.log(debitosPorDocNum)
  })

  console.log(dataCollection)
  console.log(dataAuxiliaryBook)

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

  const [SalesGoalBySeller, setSalesGoalBySeller] = useState({})
  const [collectionGoalBySeller, setCollectionGoalBySeller] = useState({})

  useEffect(() => {
    howAreYouDoing(formattedData, SalesGoalBySeller, collectionGoalBySeller)
    // howAreYouDoingCollection(formattedDataCollectionFile, collectionGoalBySeller)
    howAreYouDoingRecaudo(formattedDataCollectionFile)
    howAreYouDoingAuxiliaryBook(formattedDataAuxiliaryBookFile)
  }, [excelData, excelDataCollection, excelDataAuxiliaryBook, SalesGoalBySeller, collectionGoalBySeller])

  const sendForm = (salesGoalsFormData, collectionGoalsFormData) => {
    setSalesGoalBySeller(salesGoalsFormData)
    setCollectionGoalBySeller(collectionGoalsFormData)
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
            <InputFile label='Informe Libro auxiliar' handleChange={handleReadAuxiliaryBookFile} />
            <div className='button-group'>
              <ModalGoals title='Modificar metas' data={data} sendForm={sendForm} />
            </div>
          </div>
          <div>
            <h2>Como vamos</h2>
            <div className='d-grid gap-2 d-md-flex justify-content-md-end mb-2'>
              <ButtonDownloadExcel title='Descargar informe' data={data} currencyFormat={currencyFormat} toFixed={toFixed} />
            </div>
            <Table headers={['Vendedor', 'Total ventas', 'Cantidad de facturas', 'Promedio de ventas', 'Meta de ventas', 'Porcentaje de ventas', 'Ventas pendiente', 'Recaudo', 'Meta recaudo sin iva', 'Porcentaje de recaudo', 'Recaudo pendiente']} data={data} currencyFormat={currencyFormat} toFixed={toFixed} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
