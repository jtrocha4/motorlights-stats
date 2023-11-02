/* eslint-disable no-undef */
import React, { useContext, useEffect } from 'react'
import ModalGoals from '../components/ModalGoals'
import Swal from 'sweetalert2'
import InputCostFile from '../components/InputCostFile'
import InputCollectionFile from '../components/InputCollectionFile'
import InputAuxiliaryBookFile from '../components/InputAuxiliaryBookFile'
import { DataContext } from '../components/context/data'
import InputNewCustomersFile from '../components/InputNewCustomersFile'
import InputSaleItemFile from '../components/InputSaleItemFile'
import InputThirdParties from '../components/InputThirdParties'
import { ReportDetailsContext } from '../components/context/reportDetails'

const UploadReports = ({ toFixed, department, convertExcelDateToReadable, extractIdNumber, extractText, capitalizeWords, removeExtraSpaces }) => {
  const { data, dataCollection, dateExcel, setDateExcel, excelDataCost, salesGoalBySeller, setSalesGoalBySeller, collectionGoalBySeller, setCollectionGoalBySeller } = useContext(DataContext)

  const { dateCostFile, costReportName, collectionReportName, auxiliaryBookReportName, salesItemsReportName, thirdPartiesReportName } = useContext(ReportDetailsContext)

  const extractDateFromExcel = (dateCostFile = []) => {
    if (dateCostFile.length !== 0) {
      const date = dateCostFile.join()
      const dateFormat = /\b(?:0?[1-9]|[12][0-9]|3[01])\/(?:0?[1-9]|1[0-2])\/\d{4}\b/g
      const dateExcel = date.match(dateFormat)

      if (dateExcel === null) return console.error('The date excel is null')

      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

      const initialDate = dateExcel[0]
      const finalDate = dateExcel[1]

      const parts = finalDate.split('/')
      const month = parseInt(parts[1] - 1)
      const days = parseInt(parts[0])
      const year = parseInt(parts[2])

      const daysOfTheMonth = new Date(year, month + 1, 0).getDate()

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
        año: year,
        diasLaborales: workDays,
        diasTranscurridos: daysPassed,
        porcentajeDiasTranscurridos: percentageDaysPassed
      })
    }
  }

  const reportInputValidator = (costReportName = [], collectionReportName = [], auxiliaryBookReportName = [], saleItemReportName = [], thirdPartiesReportName = []) => {
    if (costReportName.length) {
      const reportHeader = costReportName.join()
      const costReportRegex = /Costo de Ventas Por Vendedor Detallado/
      const excelHeader = reportHeader.match(costReportRegex)
      if (!excelHeader) {
        return Swal.fire({
          icon: 'error',
          title: 'Error en el Informe Costo',
          text: 'El Informe de Costo proporcionado no es válido o está incorrecto. Por favor, revise y vuelva a intentarlo.'
        })
      }
    }

    if (collectionReportName.length) {
      const reportHeader = collectionReportName.join()
      const collectionReportRegex = /Gestión de Cobranza/
      const excelHeader = reportHeader.match(collectionReportRegex)

      if (!excelHeader) {
        return Swal.fire({
          icon: 'error',
          title: 'Error en el Informe Recaudo',
          text: 'El Informe de Recaudo proporcionado no es válido o está incorrecto. Por favor, revise y vuelva a intentarlo.'
        })
      }
    }
    if (auxiliaryBookReportName.length) {
      const reportHeader = auxiliaryBookReportName.join()
      const auxiliaryBookReportRegex = /Libro Auxiliar/
      const excelHeader = reportHeader.match(auxiliaryBookReportRegex)
      if (!excelHeader) {
        return Swal.fire({
          icon: 'error',
          title: 'Error en el Informe Libro Auxiliar',
          text: 'El Informe de Libro Auxiliar proporcionado no es válido o está incorrecto. Por favor, revise y vuelva a intentarlo.'
        })
      }
    }
    if (saleItemReportName.length) {
      const reportHeader = saleItemReportName.join()
      const saleItemReportRegex = /Ventas Por Forma de Pago Detallado por Item/
      const excelHeader = reportHeader.match(saleItemReportRegex)
      if (!excelHeader) {
        return Swal.fire({
          icon: 'error',
          title: 'Error en el Informe Venta Items',
          text: 'El Informe de Venta Items proporcionado no es válido o está incorrecto. Por favor, revise y vuelva a intentarlo.'
        })
      }
    }
    if (thirdPartiesReportName.length) {
      const reportHeader = thirdPartiesReportName.join()
      const saleItemReportRegex = /Listado de Terceros con Direcciones/
      const excelHeader = reportHeader.match(saleItemReportRegex)
      if (!excelHeader) {
        return Swal.fire({
          icon: 'error',
          title: 'Error en el Informe Terceros',
          text: 'El Informe de Terceros proporcionado no es válido o está incorrecto. Por favor, revise y vuelva a intentarlo.'
        })
      }
    }
  }

  const joinData = (dataCollection = [], dataCost = []) => {
    const collectionBySeller = []
    dataCollection.forEach(({ vendedor, totalRecaudo, metaRecaudoSinIva, porcentajeRecaudo, recaudoPendiente, comisionRecaudo, bonoResultado, clientesNuevos }) => {
      collectionBySeller.push({ vendedor, totalRecaudo, metaRecaudoSinIva, porcentajeRecaudo, recaudoPendiente, comisionRecaudo, bonoResultado, clientesNuevos })
    })
    dataCost.forEach(el => {
      const combinedData = collectionBySeller.find(element => element.vendedor === el.vendedor)

      if (combinedData) {
        el.totalRecaudo = combinedData.totalRecaudo || 0
        el.porcentajeRecaudo = combinedData.porcentajeRecaudo
        el.recaudoPendiente = combinedData.recaudoPendiente
        el.bonoResultado = combinedData.bonoResultado || 0

        // Bonos resultados
        if (el.porcentajeVentas > 100 && el.porcentajeRecaudo > 100) {
          el.bonoResultado = (el.totalRecaudo * 0.012) + combinedData.bonoResultado
        }

        if (el.clientesNuevos > 0) {
          el.bonoResultado = ((el.totalRecaudo * 0.001) * el.clientesNuevos) + combinedData.bonoResultado
        }

        el.comisionTotal = (el.comisionVenta + combinedData.comisionRecaudo + el.bonoResultado) || 0
        el.comisionRecaudo = combinedData.comisionRecaudo
      }
    })
  }

  joinData(dataCollection, data)

  localStorage.setItem('data', JSON.stringify(data))
  localStorage.setItem('dateData', JSON.stringify(dateExcel))

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
    extractDateFromExcel(dateCostFile)
    reportInputValidator(costReportName, collectionReportName, auxiliaryBookReportName, salesItemsReportName, thirdPartiesReportName)
  }, [dateCostFile, collectionReportName, auxiliaryBookReportName, salesItemsReportName, thirdPartiesReportName])

  useEffect(() => {
    sendForm()
  }, [excelDataCost])

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Cargar Informes</h2>
        <p>Añada los siguientes archivos:</p>
        <div className='inputFile-group'>
          <InputCostFile label='Informe de Costo' toFixed={toFixed} salesGoalBySeller={salesGoalBySeller} collectionGoalBySeller={collectionGoalBySeller} extractIdNumber={extractIdNumber} extractText={extractText} removeExtraSpaces={removeExtraSpaces} />
          <InputCollectionFile label='Informe de Recaudo' toFixed={toFixed} salesGoalBySeller={salesGoalBySeller} collectionGoalBySeller={collectionGoalBySeller} />
          <InputAuxiliaryBookFile label='Informe Libro auxiliar' salesGoalBySeller={salesGoalBySeller} collectionGoalBySeller={collectionGoalBySeller} />
          <InputNewCustomersFile label='Informe Clientes Nuevos' />
          <InputSaleItemFile label='Informe Ventas Items' convertExcelDateToReadable={convertExcelDateToReadable} extractIdNumber={extractIdNumber} extractText={extractText} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} />
          <InputThirdParties label='Informe de Terceros' department={department} />
          {/* <InputDepartmentAndMunicipalities label='Informe de Depart. y Munic.' /> */}
          <div className='button-group'>
            <ModalGoals title='Modificar metas' data={data} sendForm={sendForm} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadReports
