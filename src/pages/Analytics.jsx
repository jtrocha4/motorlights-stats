import React, { useContext } from 'react'
import TableAnalytics from '../components/TableAnalytics'
import { SaleItemContext } from '../components/context/saleItem'
import { DataContext } from '../components/context/data'
import ButtonDownloadAnalytics from '../components/ButtonDownloadAnalytics'

const Analytics = ({ convertExcelDateToReadable, currencyFormat, toFixed, department, capitalizeWords, extractText, extractIdNumber }) => {
  const { dateExcel } = useContext(DataContext)
  const { sellerSalesData } = useContext(SaleItemContext)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Analitica de datos </h2>
        <p>{(dateExcel.dia !== undefined && dateExcel.mes !== undefined) ? (`Fecha de la última actualización: ${dateExcel.dia} de ${dateExcel.mes} de ${dateExcel.año}`) : ('Aun no hay informes cargados, por favor cargue los informes para tener una visualizacion de la data')}</p>
        <div className='mt-4'>
          <div className='d-grid gap-2 d-md-flex justify-content-md-end mb-2'>
            <ButtonDownloadAnalytics title='Descargar informe' background='success' />
          </div>
        </div>
        <div className='mt-2'>
          <TableAnalytics sellerSalesData={sellerSalesData} convertExcelDateToReadable={convertExcelDateToReadable} currencyFormat={currencyFormat} toFixed={toFixed} department={department} capitalizeWords={capitalizeWords} extractIdNumber={extractIdNumber} extractText={extractText} />
        </div>
      </div>
    </div>
  )
}

export default Analytics
