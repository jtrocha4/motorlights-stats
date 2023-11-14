import React, { useContext } from 'react'
import ButtonDownloadAnalytics from '../components/ButtonsDownload/ButtonDownloadAnalytics'

import { SaleItemContext } from '../context/saleItem'
import { DataExcelContext } from '../context/dataExcel'
import ButtonDownloadSaleByMunicipalities from '../components/buttonsDownload/ButtonDownloadSaleByMunicipalities'
import ButtonDownloadSellerSalesByMunicipality from '../components/buttonsDownload/ButtonDownloadSellerSalesByMunicipality'

const DetailedSalesPage = ({ splitName }) => {
  const { dateExcel } = useContext(DataExcelContext)
  const { sellerSalesData } = useContext(SaleItemContext)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Informe Detallado Ventas</h2>
        <span>{(dateExcel.dia !== undefined && dateExcel.mes !== undefined) ? (`Fecha de la última actualización: ${dateExcel.dia} de ${dateExcel.mes} de ${dateExcel.año}`) : ('Aun no hay informes cargados, por favor cargue los informes para tener una visualizacion de la data')}</span>
        <section className='button-group mt-4'>
          <ButtonDownloadSaleByMunicipalities title='Descargar Ventas por Municipio' sellerSalesData={sellerSalesData} />
          <ButtonDownloadSellerSalesByMunicipality title='Descargar Ventas Vendedor por Municipio' sellerSalesData={sellerSalesData} splitName={splitName} />
        </section>
        <hr />
        <section className='button-group mt-4'>
          <ButtonDownloadAnalytics title='Descargar Informe Macro' background='success' sellerSalesData={sellerSalesData} />
        </section>
      </div>
    </div>
  )
}

export default DetailedSalesPage
