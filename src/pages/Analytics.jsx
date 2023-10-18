import React, { useContext } from 'react'
import TableAnalytics from '../components/TableAnalytics'
import { SaleItemContext } from '../components/context/saleItem'

const Analytics = ({ convertExcelDateToReadable, currencyFormat, toFixed, department, capitalizeWords }) => {
  const { dataSaleItem } = useContext(SaleItemContext)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Analitica de datos </h2>
        <div>
          <TableAnalytics dataSaleItem={dataSaleItem} convertExcelDateToReadable={convertExcelDateToReadable} currencyFormat={currencyFormat} toFixed={toFixed} department={department} capitalizeWords={capitalizeWords} />
        </div>
      </div>
    </div>
  )
}

export default Analytics
