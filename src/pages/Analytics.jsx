import React, { useContext } from 'react'
import TableAnalytics from '../components/TableAnalytics'
import { DataContext } from '../components/context/data'

const Analytics = ({ convertExcelDateToReadable, currencyFormat, toFixed, department }) => {
  const { data } = useContext(DataContext)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Analitica de datos </h2>
        <div>
          <TableAnalytics data={data} convertExcelDateToReadable={convertExcelDateToReadable} currencyFormat={currencyFormat} toFixed={toFixed} department={department} />
        </div>
      </div>
    </div>
  )
}

export default Analytics
