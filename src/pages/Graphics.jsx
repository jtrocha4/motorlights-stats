import React from 'react'
import SimpleBarCharts from '../components/charts/SimpleBarCharts'
import { FiltersProvider } from '../components/context/filters'

const Graphics = ({ sellerPerformance, extractDateFromData }) => {
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Graficos</h2>
        <div className='chart-container'>
          <FiltersProvider>
            <SimpleBarCharts sellerPerformance={sellerPerformance} extractDateFromData={extractDateFromData} />
          </FiltersProvider>
        </div>
      </div>
    </div>
  )
}

export default Graphics
