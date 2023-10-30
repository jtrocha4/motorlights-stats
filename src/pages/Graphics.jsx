import React from 'react'
import SimpleBarCharts from '../components/charts/SimpleBarCharts'

const Graphics = ({ sellerPerformance, extractDateFromData }) => {
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Graficos</h2>
        <div className='chart-container'>
          <SimpleBarCharts sellerPerformance={sellerPerformance} extractDateFromData={extractDateFromData} />
        </div>
      </div>
    </div>
  )
}

export default Graphics
