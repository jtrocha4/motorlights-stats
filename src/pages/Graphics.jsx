import React from 'react'
import SimpleBarCharts from '../components/charts/SimpleBarCharts'

const Graphics = ({ dataset, extractDateFromData }) => {
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Graficos</h2>
        <div className='chart-container'>
          <SimpleBarCharts dataset={dataset} extractDateFromData={extractDateFromData} />
        </div>
      </div>
    </div>
  )
}

export default Graphics
