/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import ButtonDownloadExcel from '../components/ButtonDownloadExcel'
import ButtonDownloadIncentivePayout from '../components/ButtonDownloadIncentivePayout'
import InputFile from '../components/InputFile'
import ModalGoals from '../components/ModalGoals'
import Swal from 'sweetalert2'
import Table from '../components/Table'
import { auxiliaryBookFileToModel, collectionFileToModel, costFileToModel } from '../mappers'
import ButtonUploadDb from '../components/ButtonUploadDb'

const Home = ({ postDataToApi }) => {
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

  const handleReadAuxiliaryBookFile = (event) => {
    const file = event.target.files[0]
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
    const costFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        if (header !== 'PorMargen' && header !== 'Costo Unitario' && header !== 'Margen') { // Filtrado de columnas, las columnas que estan dentro de la condicion no aparecen
          rowData[header] = row[index]
        }
      })
      return rowData
    })
    return costFileToModel(costFile)
  }

  const formatDataCollectionFile = (headers = [], rows = []) => {
    const collectionFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        if (header !== 'Sucursal' && header !== 'Empresa') {
          rowData[header] = row[index]
        }
      })
      return rowData
    })
    return collectionFileToModel(collectionFile)
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

  const [dateExcel, setDateExcel] = useState({})
  const extractDateFromExcel = (dateCostFile = [], dateCollectionFile = [], dateAuxiliaryBookFile = []) => {
    if (dateCostFile.length) {
      const date = dateCostFile.join()
      const dateFormat = /\b(?:0?[1-9]|[12][0-9]|3[01])\/(?:0?[1-9]|1[0-2])\/\d{4}\b/g
      const dateExcel = date.match(dateFormat)

      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

      if (!dateExcel) {
        return Swal.fire({
          icon: 'error',
          title: 'Error en el Informe Costo',
          text: 'El Informe de Costo proporcionado no es válido o está incorrecto. Por favor, revise y vuelva a intentarlo.'
        })
      }

      const initialDate = dateExcel[0]
      const finalDate = dateExcel[1]

      const parts = finalDate.split('/')
      const month = parseInt(parts[1] - 1)
      const days = parseInt(parts[0])
      const year = parseInt(parts[2])

      const daysOfTheMonth = new Date(2023, month + 1, 0).getDate()

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
        porcentajeDiasTranscurridos: percentageDaysPassed
      })
    }
    if (dateCollectionFile.length) {
      const date = dateCollectionFile.join()
      const dateFormat = /\b(?:0?[1-9]|[12][0-9]|3[01])\/(?:0?[1-9]|1[0-2])\/\d{4}\b/g
      const dateExcel = date.match(dateFormat)
      if (!dateExcel) {
        return Swal.fire({
          icon: 'error',
          title: 'Error en el Informe Recaudo',
          text: 'El Informe de Recaudo proporcionado no es válido o está incorrecto. Por favor, revise y vuelva a intentarlo.'
        })
      }
    }
    if (dateAuxiliaryBookFile.length) {
      const date = dateAuxiliaryBookFile.join()
      const dateFormat = /\b(?:0?[1-9]|[12][0-9]|3[01])\/(?:0?[1-9]|1[0-2])\/\d{4}\b/g
      const dateExcel = date.match(dateFormat)
      if (!dateExcel) {
        return Swal.fire({
          icon: 'error',
          title: 'Error en el Informe Libro Auxiliar',
          text: 'El Informe de Libro Auxiliar proporcionado no es válido o está incorrecto. Por favor, revise y vuelva a intentarlo.'
        })
      }
    }
  }

  const reportDateValidation = (dateCostFile = [], dateCollectionFile = [], dateAuxiliaryBookFile = []) => {
    if (dateCostFile.length && dateCollectionFile.length && dateAuxiliaryBookFile.length) {
      const dateCostString = dateCostFile.join()
      const dateCollectionString = dateCollectionFile.join()
      const dateAuxiliaryBookString = dateAuxiliaryBookFile.join()

      const dateFormat = /([1-9]|[12][0-9]|3[01])\/(?:0?[1-9]|1[0-2])\/\d{4}\b/g

      const dateExcelCost = dateCostString.match(dateFormat)
      const dateExcelCollection = dateCollectionString.match(dateFormat)
      const dateExcelAuxiliaryBook = dateAuxiliaryBookString.match(dateFormat)

      const finalDate = []
      if (dateExcelCost !== null && dateExcelCollection !== null && dateExcelAuxiliaryBook !== null) {
        finalDate.push(dateExcelCost[1], dateExcelCollection[1], dateExcelAuxiliaryBook[1])
      }

      if (finalDate[0] !== finalDate[1]) {
        return Swal.fire({
          icon: 'warning',
          title: 'Fechas Diferentes',
          text: 'La fecha del "Informe de Recaudo" no coincide con la fecha del "Informe de Costo". Por favor, verifique las fechas e intente nuevamente.'
        })
      }
      if (finalDate[0] !== finalDate[2]) {
        return Swal.fire({
          icon: 'warning',
          title: 'Fechas Diferentes',
          text: 'La fecha del "Informe Libro Auxiliar" no coincide con la fecha del "Informe de Costo". Por favor, verifique las fechas e intente nuevamente.'
        })
      }
      if (finalDate[1] !== finalDate[2]) {
        return Swal.fire({
          icon: 'warning',
          title: 'Fechas Diferentes',
          text: 'La fecha del "Informe de Recaudo" no coincide con la fecha del "Informe Libro Auxiliar". Por favor, verifique las fechas e intente nuevamente.'
        })
      }
    }
  }

  const formatDate = (excelDate) => {
    const excelBaseDate = new Date(1900, 0, 1)
    const days = excelDate - 1
    const formattedDate = new Date(excelBaseDate.getTime() + days * 24 * 60 * 60 * 1000)

    const month = formattedDate.getMonth() + 1
    const day = formattedDate.getDate()
    const year = formattedDate.getFullYear()

    const formattedDateString = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`

    return formattedDateString
  }

  const dateCostFile = excelData[2]
  const dateCollectionFile = excelDataCollection[1]
  const dateAuxiliaryBookFile = excelDataAuxiliaryBook[1]

  const headersCostFile = excelData[3]
  const rowsCostFile = excelData.slice(4)
  const formattedData = formatData(headersCostFile, rowsCostFile)

  const headersCollectionFile = excelDataCollection[2]
  const rowsCollectionFile = excelDataCollection.slice(3)
  const formattedDataCollectionFile = formatDataCollectionFile(headersCollectionFile, rowsCollectionFile)

  const headersAuxiliaryBookFile = excelDataAuxiliaryBook[3]
  const rowsAuxiliaryBookFile = excelDataAuxiliaryBook.slice(4)
  const formattedDataAuxiliaryBookFile = formatDataAuxiliaryBookFile(headersAuxiliaryBookFile, rowsAuxiliaryBookFile)

  const howAreWeDoing = (formattedData, salesGoalBySeller = {}, collectionGoalBySeller = {}) => {
    const saleData = {}
    const sale = []
    let currentSeller
    let sellerSales
    let total
    let totalCost
    const uniqueDocs = {}
    let billCounter
    let averageSale

    let goalSale
    let percetageSale
    let pendingSalesTarget
    let pendingCollectionTarget

    let totalWithFreight
    let margin
    let percentageMargin

    let collectionTarget
    let percentageCollected

    let splitChain

    let commission

    const motorlightsObject = {
      cantidadFacturas: 0,
      metaRecaudoSinIva: (collectionGoalBySeller['MOTORLIGHTS S.A.S'] === undefined) ? (0) : (collectionGoalBySeller['MOTORLIGHTS S.A.S']),
      metaVentas: (salesGoalBySeller['MOTORLIGHTS S.A.S'] === undefined) ? (0) : (salesGoalBySeller['MOTORLIGHTS S.A.S']),
      porcentajeRecaudo: 0,
      porcentajeVentas: 0,
      promedioVentas: 0,
      recaudoPendiente: 0,
      totalRecaudo: 0,
      totalVenta: 0,
      vendedor: 'MOTORLIGHTS S.A.S',
      ventasPendiente: 0,
      comisionTotal: 0
    }

    formattedData.forEach(row => {
      if (row.codigoInventario !== undefined) {
        splitChain = row.codigoInventario.split(' ')
      }
      if (row.vendedor) {
        if (row.vendedor.startsWith('Total')) {
          if (currentSeller) {
            // Calculo de operaciones
            billCounter = Object.keys(uniqueDocs[currentSeller] || {}).length

            averageSale = total / Object.keys(uniqueDocs[currentSeller] || {}).length
            averageSale = (averageSale !== -Infinity) ? (total / Object.keys(uniqueDocs[currentSeller] || {}).length) : 0

            goalSale = salesGoalBySeller[currentSeller] || 0
            percetageSale = (goalSale !== 0) ? ((total * 100) / goalSale) : (0)
            pendingSalesTarget = goalSale - total

            margin = totalWithFreight - totalCost
            percentageMargin = (totalWithFreight !== 0) ? ((margin * 100) / totalWithFreight) : (0)

            collectionTarget = collectionGoalBySeller[currentSeller] || 0
            percentageCollected = 100
            pendingCollectionTarget = collectionGoalBySeller[currentSeller] || 0

            // Aproximacion de los datos
            averageSale = toFixed(averageSale, 2)
            percetageSale = toFixed(percetageSale, 1)
            pendingSalesTarget = toFixed(pendingSalesTarget, 2)
            percentageMargin = toFixed(percentageMargin, 1)

            // Comisiones
            let salesBonus
            if (percetageSale >= 100) {
              salesBonus = total * 0.01
              commission = salesBonus
            }

            saleData[currentSeller] = sellerSales
            sale.push(
              {
                cantidadFacturas: billCounter,
                comisionTotal: 0,
                comisionVenta: commission,
                margen: margin,
                metaRecaudoSinIva: collectionTarget,
                metaVentas: goalSale,
                porcentajeMargen: percentageMargin,
                porcentajeRecaudo: percentageCollected,
                porcentajeVentas: percetageSale,
                promedioVentas: averageSale,
                recaudoPendiente: pendingCollectionTarget,
                totalCosto: totalCost,
                totalRecaudo: 0,
                totalVenta: total,
                vendedor: currentSeller,
                venta: saleData[currentSeller],
                ventasPendiente: pendingSalesTarget
              }
            )
          }
          currentSeller = null
          sellerSales = null
          total = 0
          totalWithFreight = 0
          totalCost = 0
          commission = 0
        } else {
          currentSeller = row.vendedor
          sellerSales = []
          total = 0
          totalWithFreight = 0
          totalCost = 0
          commission = 0
        }
      }
      if (currentSeller && sellerSales) {
        totalWithFreight += row.ventas || 0
      }
      if (currentSeller && sellerSales && !splitChain[1].startsWith('Flete')) {
        sellerSales.push(row)
        total += row.ventas || 0
        totalCost += row.totalCosto || 0
        if (!uniqueDocs[currentSeller]) {
          uniqueDocs[currentSeller] = {}
        }
        if (row.doc.startsWith('FV')) {
          uniqueDocs[currentSeller][row.doc] = true
        }
      }
    })
    if (sale.length) {
      const found = sale.find(el => el.vendedor === 'MOTORLIGHTS S.A.S')
      if (found === undefined) {
        sale.push(motorlightsObject)
      }
    }
    setData(sale)
  }

  const [errorRc, setErrorRc] = useState([])

  const howAreWeDoingCollection = async (formattedDataCollectionFile, debitForDocNum, collectionGoalBySeller = {}) => {
    const collectionData = {}
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

    let commission
    let resultBonus

    const errorRc = []

    formattedDataCollectionFile.forEach(row => {
      if (row.rc in debitForDocNum) {
        row.recaudo = debitForDocNum[row.rc]
      } else {
        errorRc.push(`(MS) rc ${row.rc}`)
        row.recaudo = 0
      }
      if (row.vendedor) {
        if (row.vendedor.startsWith('Total')) {
          if (currentSeller) {
            totalWithoutVAT = parseFloat(total / iva)
            collectionTarget = collectionGoalBySeller[currentSeller]
            percentageCollected = (totalWithoutVAT * 100) / collectionTarget
            pendingCollectionTarget = collectionTarget - totalWithoutVAT

            percentageCollected = toFixed(percentageCollected, 1)

            // Comisiones
            let collectionBonus
            const firstBonus = totalWithoutVAT * 0.02

            if (percentageCollected >= 100) {
              collectionBonus = totalWithoutVAT * 0.01
              commission = collectionBonus
            }

            resultBonus = firstBonus

            collectionData[currentSeller] = sellerSales
            sellerCollection.push({
              vendedor: currentSeller,
              recaudo: collectionData[currentSeller],
              totalRecaudo: totalWithoutVAT,
              metaRecaudoSinIva: 0,
              porcentajeRecaudo: percentageCollected,
              recaudoPendiente: pendingCollectionTarget,
              comisionRecaudo: commission,
              comisionTotal: 0,
              bonoResultado: resultBonus
            })
          }
          currentSeller = null
          sellerSales = null
          total = 0
          commission = 0
          resultBonus = 0
        } else {
          currentSeller = row.vendedor
          sellerSales = []
          total = 0
          commission = 0
          resultBonus = 0
        }
      }
      if (currentSeller && sellerSales) {
        sellerSales.push(row)
        if (!uniqueRC[row.rc]) {
          uniqueRC[row.rc] = row.recaudo
          total += uniqueRC[row.rc]
        }
      }
    })
    setErrorRc(errorRc.filter(el => el !== '(MS) rc undefined'))
    setDataCollection(sellerCollection)
  }

  const [totalDebitByDocNum, setTotalDebitByDocNum] = useState({})

  const howAreWeDoingAuxiliaryBook = async (formattedDataAuxiliaryBookFile) => {
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

  const joinData = (dataCollection = [], dataCost = []) => {
    const collectionBySeller = []
    dataCollection.forEach(({ vendedor, totalRecaudo, metaRecaudoSinIva, porcentajeRecaudo, recaudoPendiente, comisionRecaudo, bonoResultado }) => {
      collectionBySeller.push({ vendedor, totalRecaudo, metaRecaudoSinIva, porcentajeRecaudo, recaudoPendiente, comisionRecaudo, bonoResultado })
    })
    dataCost.forEach(el => {
      const combinedData = collectionBySeller.find(element => element.vendedor === el.vendedor)

      if (combinedData) {
        el.totalRecaudo = combinedData.totalRecaudo || 0
        el.porcentajeRecaudo = combinedData.porcentajeRecaudo
        el.recaudoPendiente = combinedData.recaudoPendiente
        el.bonoResultado = combinedData.bonoResultado || 0

        if (el.porcentajeVentas > 100 && el.porcentajeRecaudo > 100) {
          el.bonoResultado = (el.totalRecaudo * 0.012) + combinedData.bonoResultado
        }

        el.comisionTotal = (el.comisionVenta + combinedData.comisionRecaudo + el.bonoResultado) || 0
        el.comisionRecaudo = combinedData.comisionRecaudo
      }
    })
  }

  joinData(dataCollection, data)

  const [salesGoalBySeller, setSalesGoalBySeller] = useState({})
  const [collectionGoalBySeller, setCollectionGoalBySeller] = useState({})

  useEffect(() => {
    howAreWeDoing(formattedData, salesGoalBySeller, collectionGoalBySeller)
    howAreWeDoingAuxiliaryBook(formattedDataAuxiliaryBookFile)
    extractDateFromExcel(dateCostFile, dateCollectionFile, dateAuxiliaryBookFile)
    reportDateValidation(dateCostFile, dateCollectionFile, dateAuxiliaryBookFile)
  }, [excelData, excelDataCollection, excelDataAuxiliaryBook, salesGoalBySeller, collectionGoalBySeller])

  localStorage.setItem('data', JSON.stringify(data))
  localStorage.setItem('dateData', JSON.stringify(dateExcel))

  useEffect(() => {
    howAreWeDoingCollection(formattedDataCollectionFile, totalDebitByDocNum, collectionGoalBySeller)
  }, [totalDebitByDocNum, dataAuxiliaryBook])

  const sendForm = () => {
    const salesGoals = JSON.parse(localStorage.getItem('metaVentas'))
    const collectionGoals = JSON.parse(localStorage.getItem('metaRecaudo'))
    if (salesGoals !== null) {
      setSalesGoalBySeller(salesGoals)
    }
    if (salesGoals !== null) {
      setCollectionGoalBySeller(collectionGoals)
    }
  }

  useEffect(() => {
    sendForm()
  }, [excelData])

  return (
    <div className='flex'>
      <div className='container-fluid'>
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
            <ButtonDownloadExcel title='Descargar informe' data={data} toFixed={toFixed} dateExcel={dateExcel} />
            <ButtonDownloadIncentivePayout title='Descargar Liq. de incentivos' data={data} dataCollection={dataCollection} formatDate={formatDate} errorRc={errorRc} dateExcel={dateExcel} />
            <ButtonUploadDb title='Guardad informacion' background='primary' data={data} postDataToApi={postDataToApi} dateData={dateExcel} />
          </div>
          <div>
            <Table headers={['Vendedor', 'Total ventas', 'Cantidad de facturas', 'Promedio de ventas', 'Meta de ventas', 'Porcentaje de ventas', 'Ventas pendiente', 'Recaudo', 'Meta recaudo sin iva', 'Porcentaje de recaudo', 'Recaudo pendiente']} data={data} currencyFormat={currencyFormat} toFixed={toFixed} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home