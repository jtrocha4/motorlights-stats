/* eslint-disable no-undef */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Bar, CartesianGrid, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Calendar from '../components/calendar/Calendar'
import Filters from '../components/Filters'
import ButtonDownloadImg from '../components/buttonsDownload/ButtonDownloadImg'
import { DataContext } from '../context/data'
import { FiltersContext } from '../context/filters'

const SimpleBarCharts = ({ sellerPerformance, extractDateFromData }) => {
  const [screenSize, setScreenSize] = useState(0)

  const { filters } = useContext(FiltersContext)
  const { sellers } = useContext(DataContext)

  const localData = JSON.parse(localStorage.getItem('data')) || {}
  const localDateData = JSON.parse(localStorage.getItem('dateData')) || {}

  let porcentajeDiasTranscurridos, dia, mes

  const getLengthOfObject = (object) => {
    const lengthOfObject = Object.keys(object).length
    return lengthOfObject
  }

  if (getLengthOfObject(localDateData) === 0 && extractDateFromData(sellerPerformance)) {
    porcentajeDiasTranscurridos = extractDateFromData(sellerPerformance).porcentajeDiasTranscurridos
    dia = extractDateFromData(sellerPerformance).dia
    mes = extractDateFromData(sellerPerformance).mes
  } else {
    porcentajeDiasTranscurridos = localDateData.porcentajeDiasTranscurridos
    dia = localDateData.dia
    mes = localDateData.mes
  }

  const percentageData = []

  const splitName = (name) => {
    if (name !== undefined) {
      const nameChain = name.split(' ')
      const firstAndMiddleName = `${nameChain[0]} ${nameChain[1]}`
      return firstAndMiddleName
    }
  }

  const addDataToPercentageData = (dataArray = [], percentageArray = []) => {
    dataArray.forEach(({ vendedor, idVendedor, porcentajeVentas, porcentajeRecaudo }) => {
      let firstAndMiddleName = ''
      if (vendedor) {
        firstAndMiddleName = splitName(vendedor)
        sellers.forEach(element => {
          if (vendedor === element.identificacion) {
            percentageArray.push({
              vendedor: firstAndMiddleName,
              idVendedor: element.id,
              porcentajeVentas,
              porcentajeRecaudo,
              porcentajeMes: porcentajeDiasTranscurridos
            })
          }
        })
      } else {
        if (idVendedor) {
          firstAndMiddleName = splitName(idVendedor.nombre)
          percentageArray.push({
            vendedor: firstAndMiddleName,
            idVendedor: idVendedor.id,
            porcentajeVentas,
            porcentajeRecaudo,
            porcentajeMes: porcentajeDiasTranscurridos
          })
        }
      }
    })
  }

  if (localData.length === 0) {
    addDataToPercentageData(sellerPerformance, percentageData)
  } else {
    addDataToPercentageData(localData, percentageData)
  }

  // const leakedData = percentageData.filter(({ vendedor }) => vendedor !== 'MOTORLIGHTS S.A.S')

  const leakedData = percentageData.filter(({ idVendedor }) => filters.seller.includes(idVendedor))

  const customLegendFormatter = (value, entry) => {
    return <span style={{ color: '#7d7a79' }}>{value}</span>
  }

  const customTooltipFormatter = (value, name, props) => {
    return `${value}%`
  }

  const containerRef = useRef(null)

  const calculateScreenSize = () => {
    const screenSize = screen.width - 400
    setScreenSize(screenSize)
  }

  useEffect(() => {
    calculateScreenSize()
  }, [])

  return (
    <>
      <h4 className='text-center mb-4'>{(dia !== undefined && mes !== undefined) ? (`Como Vamos ${dia} ${mes}`) : 'Como Vamos'}</h4>
      <section className='charts-button-group'>
        {/* <div className='chart-button'><Calendar /></div> */}
        <div className='chart-button'><Filters splitName={splitName} /></div>
      </section>
      <section className='charts-button-download'>
        <ButtonDownloadImg title='Descargar grafica' fileName='Como Vamos' screenSize={screenSize} containerRef={containerRef} date={`${dia} ${mes}`} />
      </section>
      <section>
        <div ref={containerRef} className='simple-bar-charts' id='simple-bar-charts'>
          <ResponsiveContainer width={screenSize} aspect={3}>
            <ComposedChart data={leakedData} width={500} height={300} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='vendedor' tick={{ fill: '#7d7a79' }} />
              <YAxis tick={{ fill: '#7d7a79' }} tickFormatter={customTooltipFormatter} />
              <Tooltip formatter={customTooltipFormatter} />
              <Legend verticalAlign='top' height={36} formatter={customLegendFormatter} wrapperStyle={{ color: '#7d7a79' }} />
              <Bar name='% Ventas' dataKey='porcentajeVentas' fill='#4673bf'>
                <LabelList dataKey='porcentajeVentas' position='top' fill='#7d7a79' formatter={customTooltipFormatter} />
              </Bar>

              <Bar name='% Recaudo' dataKey='porcentajeRecaudo' fill='#fafa0c' color='black'>
                <LabelList dataKey='porcentajeRecaudo' position='top' fill='#7d7a79' formatter={customTooltipFormatter} />
              </Bar>

              <Line name='Avance del mes' dataKey='porcentajeMes' stroke='#fd0001'>
                <LabelList dataKey='porcentajeMes' position='insideBottomLeft' fill='#7d7a79' formatter={customTooltipFormatter} />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  )
}

export default SimpleBarCharts
