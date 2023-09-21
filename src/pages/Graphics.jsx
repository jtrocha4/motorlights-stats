import React from 'react'
import SimpleBarCharts from '../components/charts/SimpleBarCharts'

const Graphics = () => {
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Graficos</h2>
        <div className='chart-container'>
          <SimpleBarCharts />
        </div>
      </div>
    </div>
  )
}

export default Graphics
