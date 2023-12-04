import React, { useContext } from 'react'
import ButtonDownloadAnalytics from '../components/buttonsDownload/ButtonDownloadAnalytics'
import { SaleItemContext } from '../context/saleItem'
import { DataExcelContext } from '../context/dataExcel'
import ButtonDownloadSalesByMunicipality from '../components/buttonsDownload/ButtonDownloadSalesByMunicipality'
import ButtonDownloadSellerSalesByMunicipality from '../components/buttonsDownload/ButtonDownloadSellerSalesByMunicipality'
import ButtonDownloadSalesMonthSellerByMunicipality from '../components/buttonsDownload/ButtonDownloadSalesMonthSellerByMunicipality'
import ButtonDownloadSalesCustomerSellerByMunicipality from '../components/buttonsDownload/ButtonDownloadSalesCustomerSellerByMunicipality'
import ButtonDownloadSalesMonthSellerCustomerByMunicipality from '../components/buttonsDownload/ButtonDownloadSalesMonthSellerCustomerByMunicipality'
import TableDynamicDetailedSales from '../components/tables/TableDynamicDetailedSales'

const DetailedSalesPage = ({ splitName }) => {
  const { dateExcel } = useContext(DataExcelContext)
  const { sellerSalesData } = useContext(SaleItemContext)

  const sellerSalesProcessedData = sellerSalesData
    .filter(row => !row.producto.startsWith('Flete'))

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Informe Detallado Ventas</h2>
        <span>{(dateExcel.dia !== undefined && dateExcel.mes !== undefined) ? (`Fecha de la última actualización: ${dateExcel.dia} de ${dateExcel.mes} de ${dateExcel.año}`) : ('Aun no hay informes cargados, por favor cargue los informes para tener una visualizacion de la data')}</span>
        <section className='button-group mt-4'>
          <ButtonDownloadSalesByMunicipality title='Descargar Ventas por Municipio' sellerSalesData={sellerSalesProcessedData} />
          <ButtonDownloadSellerSalesByMunicipality title='Descargar Ventas Vendedor por Municipio' sellerSalesData={sellerSalesProcessedData} splitName={splitName} />
          <ButtonDownloadSalesMonthSellerByMunicipality title='Descargar Ventas Mes Vendedor por Municipio' sellerSalesData={sellerSalesProcessedData} splitName={splitName} />
          <ButtonDownloadSalesCustomerSellerByMunicipality title='Descargar Ventas Cliente Vendedor por Municipio' sellerSalesData={sellerSalesProcessedData} splitName={splitName} />
          <ButtonDownloadSalesMonthSellerCustomerByMunicipality title='Descargar Ventas Mes Vendedor Cliente por Municipio' sellerSalesData={sellerSalesProcessedData} splitName={splitName} />
          <ButtonDownloadAnalytics title='Descargar Informe Macro' background='success' sellerSalesData={sellerSalesProcessedData} />
        </section>
        <hr />
        <section className='m-auto'>
          <TableDynamicDetailedSales sellerSalesData={sellerSalesProcessedData} />
        </section>
      </div>
    </div>
  )
}

export default DetailedSalesPage
