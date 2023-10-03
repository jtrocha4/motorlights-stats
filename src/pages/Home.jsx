/* eslint-disable no-undef */
import React, { useContext, useEffect } from 'react'
import ButtonDownloadExcel from '../components/ButtonDownloadExcel'
import ButtonDownloadIncentivePayout from '../components/ButtonDownloadIncentivePayout'
import ModalGoals from '../components/ModalGoals'
import Swal from 'sweetalert2'
import Table from '../components/Table'
import ButtonUploadDb from '../components/ButtonUploadDb'
import InputCostFile from '../components/InputCostFile'
import InputCollectionFile from '../components/InputCollectionFile'
import InputAuxiliaryBookFile from '../components/InputAuxiliaryBookFile'
import { DataContext } from '../components/context/data'
import { DateContext } from '../components/context/dateFile'

const Home = ({ postDataToApi }) => {
  const { dataCost, dataCollection, dateExcel, setDateExcel, excelDataCost, salesGoalBySeller, setSalesGoalBySeller, collectionGoalBySeller, setCollectionGoalBySeller } = useContext(DataContext)

  const { dateCostFile, dateCollectionFile, dateAuxiliaryBookFile } = useContext(DateContext)

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

  const extractDateFromExcel = (dateCostFile = [], dateCollectionFile = [], dateAuxiliaryBookFile = []) => {
    if (dateCostFile.length !== 0) {
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
        diasLaborales: workDays,
        diasTranscurridos: daysPassed,
        porcentajeDiasTranscurridos: percentageDaysPassed
      })
    }
    if (dateCollectionFile.length) {
      const date = dateCollectionFile.join()
      const dateFormat = /Gestión de Cobranza/
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
      const dateFormat = /Libro Auxiliar/
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

  joinData(dataCollection, dataCost)

  localStorage.setItem('data', JSON.stringify(dataCost))
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
    extractDateFromExcel(dateCostFile, dateCollectionFile, dateAuxiliaryBookFile)
  }, [dateCostFile, dateCollectionFile, dateAuxiliaryBookFile])

  useEffect(() => {
    sendForm()
  }, [excelDataCost])

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Inicio</h2>
        <p>Añada los siguientes archivos:</p>
        <div className='inputFile-group'>
          <InputCostFile label='Informe de Costo' toFixed={toFixed} salesGoalBySeller={salesGoalBySeller} collectionGoalBySeller={collectionGoalBySeller} />

          <InputCollectionFile label='Informe de Recaudo' toFixed={toFixed} collectionGoalBySeller={collectionGoalBySeller} />

          <InputAuxiliaryBookFile label='Informe Libro auxiliar' />

          <div className='button-group'>
            <ModalGoals title='Modificar metas' data={dataCost} sendForm={sendForm} />
          </div>
        </div>
        <div>
          <h2>{(dateExcel.dia !== undefined && dateExcel.mes !== undefined) ? (`Como Vamos ${dateExcel.dia} ${dateExcel.mes}`) : ('Como Vamos')}</h2>
          <div className='d-grid gap-2 d-md-flex justify-content-md-end mb-2'>
            <ButtonDownloadExcel
              title='Descargar informe' data={dataCost} toFixed={toFixed}
            />

            <ButtonDownloadIncentivePayout
              title='Descargar Liq. de incentivos' data={dataCost}
              formatDate={formatDate} errorRc={[]}
            />
            <ButtonUploadDb
              title='Guardar informacion' background='primary'
              data={dataCost}
              postDataToApi={postDataToApi}
            />
          </div>
          <div className='table-responsive'>
            <Table data={dataCost} currencyFormat={currencyFormat} toFixed={toFixed} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
