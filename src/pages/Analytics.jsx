import React, { useContext } from 'react'
import TableAnalytics from '../components/TableAnalytics'
import { DataContext } from '../components/context/data'

const Analytics = ({ convertExcelDateToReadable, currencyFormat, toFixed }) => {
  const { data } = useContext(DataContext)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Analitica de datos </h2>
        <div>
          <TableAnalytics data={data} convertExcelDateToReadable={convertExcelDateToReadable} currencyFormat={currencyFormat} toFixed={toFixed} />
        </div>
      </div>
    </div>
  )
}

export default Analytics
