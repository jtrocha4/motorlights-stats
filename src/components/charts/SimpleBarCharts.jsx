/* eslint-disable no-undef */
import React from 'react'
import { Bar, CartesianGrid, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const SimpleBarCharts = () => {
  const data = JSON.parse(localStorage.getItem('data')) || {}
  const dateData = JSON.parse(localStorage.getItem('dateData')) || {}
  const { porcentajeDiasTranscurridos, dia, mes } = dateData
  const percentageData = []

  data.forEach(({ vendedor, porcentajeVentas, porcentajeRecaudo }) => {
    const splitName = vendedor.split(' ')
    const firstAndMiddleName = `${splitName[0]} ${splitName[1]}`
    percentageData.push({
      vendedor: firstAndMiddleName,
      porcentajeVentas,
      porcentajeRecaudo,
      porcentajeMes: porcentajeDiasTranscurridos
    })
  })

  const customLegendFormatter = (value, entry) => {
    return <span style={{ color: '#7d7a79' }}>{value}</span>
  }

  const customTooltipFormatter = (value, name, props) => {
    return `${value}%`
  }

  return (
    <div>
      <h4 className='text-center'>{`Como Vamos ${dia} ${mes}`}</h4>
      <ResponsiveContainer width='100%' aspect={3}>
        <ComposedChart data={percentageData} width={500} height={300} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
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

          <Line name='Avance del mes' dataKey='porcentajeMes' stroke='#fd0001' />
        </ComposedChart>
      </ResponsiveContainer>

    </div>
  )
}

export default SimpleBarCharts
