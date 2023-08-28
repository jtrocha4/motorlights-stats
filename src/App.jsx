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
        if (header !== 'Total Costo' && header !== 'PorMargen' && header !== 'Costo Unitario' && header !== 'Margen') { // Filtrado de columnas, las columnas que estan dentro de la condicion no aparecen
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

  const [dateExcel, setDateExcel] = useState({})
  const extractDateFromExcel = (dateRow = []) => {
    if (dateRow.length) {
      const date = dateRow.join()
      const dateFormat = /\b(?:0?[1-9]|[12][0-9]|3[01])\/(?:0?[1-9]|1[0-2])\/\d{4}\b/g
      const dateExcel = date.match(dateFormat)

      //
      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

      if (!dateExcel) {
        // console.log('Date excel undefined, El informe de costo no es el correcto')
        return
      }

      const initialDate = dateExcel[0]
      const finalDate = dateExcel[1]

      const parts = finalDate.split('/')
      const month = parseInt(parts[1] - 1)
      const days = parseInt(parts[0])
      const year = parseInt(parts[2])

      const daysOfTheMonth = new Date(2023, month, 0).getDate()

      const countSundays = (year, month) => {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        let count = 0

        for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
          const currentDay = new Date(year, month, day)
          if (currentDay.getDay() === 0) { // 0 representa domingo en getDay()
            count++
          }
        }

        return count
      }

      const daysElapsed = (year, month, day) => {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month, day)
        let countSunday = 0
        let countDays = 0
        for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
          const currentDay = new Date(year, month, day)
          if (currentDay.getDay() === 0) { // 0 representa domingo en getDay()
            countSunday++
          }
          countDays++
        }

        return countDays - countSunday
      }

      const sundays = countSundays(year, month)

      const workDays = daysOfTheMonth - sundays

      const daysPassed = daysElapsed(year, month, days)
      let percentageDaysPassed = parseFloat((daysPassed * 100) / workDays)
      percentageDaysPassed = toFixed(percentageDaysPassed, 1)

      setDateExcel({
        fechaInicial: initialDate,
        fechaFinal: finalDate,
        dia: days,
        mes: months[month],
        diasLaborales: workDays,
        diasTranscurridos: daysPassed,
        PorcentajeDiasTranscurridos: percentageDaysPassed
      })
    }
  }

  const dateRow = excelData[2]

  const headersCostFile = excelData[3]
  const rowsCostFile = excelData.slice(4)
  const formattedData = formatData(headersCostFile, rowsCostFile)

  const headersCollectionFile = excelDataCollection[2]
  const rowsCollectionFile = excelDataCollection.slice(3)
  const formattedDataCollectionFile = formatDataCollectionFile(headersCollectionFile, rowsCollectionFile)

  const headersAuxiliaryBookFile = excelDataAuxiliaryBook[3]
  const rowsAuxiliaryBookFile = excelDataAuxiliaryBook.slice(4)
  const formattedDataAuxiliaryBookFile = formatDataAuxiliaryBookFile(headersAuxiliaryBookFile, rowsAuxiliaryBookFile)

  const howAreWeDoing = (formattedData, SalesGoalBySeller = {}, collectionGoalBySeller = {}) => {
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

    let splitChain

    const motorlightsObject = {
      cantidadFacturas: 0,
      metaRecaudoSinIva: collectionGoalBySeller['MOTORLIGHTS S.A.S'],
      metaVentas: SalesGoalBySeller['MOTORLIGHTS S.A.S'],
      porcentajeRecaudo: 0,
      porcentajeVentas: 0,
      promedioVentas: 0,
      recaudoPendiente: 0,
      totalRecaudo: 0,
      totalVenta: 0,
      vendedor: 'MOTORLIGHTS S.A.S',
      ventasPendiente: 0
    }

    formattedData.forEach(row => {
      if (row['CódigoInventario'] !== undefined) {
        splitChain = row['CódigoInventario'].split(' ')
      }
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
                cantidadFacturas: billCounter,
                metaRecaudoSinIva: collectionTarget,
                metaVentas: goalSale,
                porcentajeRecaudo: percentageCollected,
                porcentajeVentas: percetageSale,
                promedioVentas: averageSale,
                recaudoPendiente: pendingCollectionTarget,
                totalRecaudo: 0,
                totalVenta: total,
                vendedor: currentSeller,
                ventasPendiente: pendingSalesTarget
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
      if (currentSeller && sellerSales && !splitChain[1].startsWith('Flete')) {
        sellerSales.push(row)
        total += row.Ventas || 0
        if (!uniqueDocs[currentSeller]) {
          uniqueDocs[currentSeller] = {}
        }
        if (row.Doc.startsWith('FV')) {
          uniqueDocs[currentSeller][row.Doc] = true
        }
      }
    })
    if (totalSales.length) {
      const found = totalSales.find(el => el.vendedor === 'MOTORLIGHTS S.A.S')
      if (found === undefined) {
        totalSales.push(motorlightsObject)
      }
    }
    setData(totalSales)
  }

  const howAreWeDoingCollection = async (formattedDataCollectionFile, debitForDocNum, collectionGoalBySeller = {}) => {
    const sellerData = {}
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

    formattedDataCollectionFile.forEach(row => {
      if (row.RC in debitForDocNum) {
        row.Recaudo = debitForDocNum[row.RC]
      }
      if (row.Vendedor) {
        if (row.Vendedor.startsWith('Total')) {
          if (currentSeller) {
            totalWithoutVAT = total / iva
            collectionTarget = collectionGoalBySeller[currentSeller]
            percentageCollected = (totalWithoutVAT * 100) / collectionTarget
            pendingCollectionTarget = collectionTarget - totalWithoutVAT

            percentageCollected = toFixed(percentageCollected, 1)

            sellerData[currentSeller] = sellerSales
            sellerCollection.push({
              vendedor: currentSeller,
              recaudo: sellerData[currentSeller],
              totalRecaudo: totalWithoutVAT,
              metaRecaudoSinIva: 0,
              porcentajeRecaudo: percentageCollected,
              recaudoPendiente: pendingCollectionTarget
            })
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
        if (!uniqueRC[row.RC]) {
          uniqueRC[row.RC] = row.Recaudo
          total += uniqueRC[row.RC]
        }
      }
    })
    setDataCollection(sellerCollection)
  }

  const howAreWeDoingAuxiliaryBook = async (formattedDataAuxiliaryBookFile) => {
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
    const debitForDocNum = {}
    sellerCollectionFilter.forEach(collection => {
      collection.forEach(el => {
        const docNum = el['Doc Num']
        const debit = parseFloat(el.Debitos)
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

  const [totalDebitByDocNum, setTotalDebitByDocNum] = useState({})

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
    howAreWeDoing(formattedData, SalesGoalBySeller, collectionGoalBySeller)
    howAreWeDoingAuxiliaryBook(formattedDataAuxiliaryBookFile)
    extractDateFromExcel(dateRow)
  }, [excelData, excelDataCollection, excelDataAuxiliaryBook, SalesGoalBySeller, collectionGoalBySeller])

  useEffect(() => {
    howAreWeDoingCollection(formattedDataCollectionFile, totalDebitByDocNum, collectionGoalBySeller)
  }, [totalDebitByDocNum, dataAuxiliaryBook])

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
              <ButtonDownloadExcel title='Descargar informe' data={data} currencyFormat={currencyFormat} toFixed={toFixed} dateExcel={dateExcel} />
            </div>
            <div>
              <Table headers={['Vendedor', 'Total ventas', 'Cantidad de facturas', 'Promedio de ventas', 'Meta de ventas', 'Porcentaje de ventas', 'Ventas pendiente', 'Recaudo', 'Meta recaudo sin iva', 'Porcentaje de recaudo', 'Recaudo pendiente']} data={data} currencyFormat={currencyFormat} toFixed={toFixed} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
