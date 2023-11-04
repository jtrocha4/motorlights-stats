import React, { useContext } from 'react'
import { DataContext } from '../components/context/data'
import ButtonDownloadAnalytics from '../components/ButtonDownloadAnalytics'
import { SaleItemContext } from '../components/context/saleItem'

const DetailedSalesPage = () => {
  const { dateExcel } = useContext(DataContext)
  const { sellerSalesData } = useContext(SaleItemContext)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Informe Detallado Ventas</h2>
        <span>{(dateExcel.dia !== undefined && dateExcel.mes !== undefined) ? (`Fecha de la última actualización: ${dateExcel.dia} de ${dateExcel.mes} de ${dateExcel.año}`) : ('Aun no hay informes cargados, por favor cargue los informes para tener una visualizacion de la data')}</span>
        <section className='button-group mt-4'>
          <ButtonDownloadAnalytics title='Descargar Informe Macro' background='success' sellerSalesData={sellerSalesData} />
        </section>
      </div>
    </div>
  )
}

export default DetailedSalesPage
