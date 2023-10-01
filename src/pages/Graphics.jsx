import React from 'react'
import SimpleBarCharts from '../components/charts/SimpleBarCharts'

const Graphics = ({ dataset, dateData }) => {
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Graficos</h2>
        <div className='chart-container'>
          <SimpleBarCharts dataset={dataset} dateData={dateData} />
        </div>
      </div>
    </div>
  )
}

export default Graphics
