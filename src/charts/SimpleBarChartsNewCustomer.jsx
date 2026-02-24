import React, { useContext, useEffect, useRef, useState } from 'react'
import { Bar, CartesianGrid, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Filters from '../components/Filters'
import ButtonDownloadImg from '../components/buttonsDownload/ButtonDownloadImg'
import { FiltersContext } from '../context/filters'
import { DataContext } from '../context/data'

const SimpleBarChartsNewCustomer = ({ sellerPerformance, extractDateFromData }) => {
  const [screenSize, setScreenSize] = useState(0)

  const splitName = (name) => {
    if (name !== undefined) {
      const nameChain = name.split(' ')
      const firstAndMiddleName = `${nameChain[0]} ${nameChain[1]}`
      return firstAndMiddleName
    }
  }

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

  const addDataToPercentageData = (dataArray = [], valueArray = []) => {
    dataArray.forEach(({ vendedor, idVendedor, clientesNuevos }) => {
      let firstAndMiddleName = ''
      if (vendedor) {
        firstAndMiddleName = splitName(vendedor)
        sellers.forEach(element => {
          if (vendedor === element.identificacion) {
            valueArray.push({
              vendedor: firstAndMiddleName,
              idVendedor: element.id,
              clientesNuevos: clientesNuevos.length,
              porcentajeMes: porcentajeDiasTranscurridos
            })
          }
        })
      } else {
        if (idVendedor) {
          firstAndMiddleName = splitName(idVendedor.nombre)
          valueArray.push({
            vendedor: firstAndMiddleName,
            idVendedor: idVendedor.id,
            clientesNuevos: clientesNuevos.length,
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

  const leakedData = percentageData.filter(({ idVendedor }) => filters.seller.includes(idVendedor))

  const customLegendFormatter = (value, entry) => {
    return <span style={{ color: '#7d7a79' }}>{value}</span>
  }

  const customTooltipFormatter = (value, name, props) => {
    return `${value}`
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
      <section className='charts-button-group'>
        <div className='chart-button'>
          <Filters splitName={splitName} />
        </div>
      </section>
      <section className='charts-button-download'>
        <ButtonDownloadImg title='Descargar grafica' fileName='Clientes Nuevos por Asesor' screenSize={screenSize} containerRef={containerRef} date={`${dia} ${mes}`} />
      </section>
      <section ref={containerRef}>
        <h4 className='text-center mt-2'>{(dia !== undefined && mes !== undefined) ? (`Clientes Nuevos por Asesor ${dia} ${mes}`) : 'Clientes Nuevos por Asesor'}</h4>
        <div className='simple-bar-charts'>
          <ResponsiveContainer width={screenSize} aspect={2}>
            <ComposedChart data={leakedData} margin={{ top: 50, bottom: 95 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='vendedor' tick={{ fill: '#7d7a79' }} angle={-40} dy={50} />
              <YAxis tick={{ fill: '#7d7a79' }} tickFormatter={customTooltipFormatter} />
              <Tooltip formatter={customTooltipFormatter} />
              <Legend verticalAlign='top' height={36} formatter={customLegendFormatter} wrapperStyle={{ color: '#7d7a79' }} />
              <Bar name='Clientes nuevos' dataKey='clientesNuevos' fill='#4673bf'>
                <LabelList dataKey='clientesNuevos' position='top' fill='#7d7a79' formatter={customTooltipFormatter} />
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

export default SimpleBarChartsNewCustomer
