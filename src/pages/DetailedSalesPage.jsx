import React, { useContext } from 'react'
import ButtonDownloadAnalytics from '../components/buttonsDownload/ButtonDownloadAnalytics'
import { SaleItemContext } from '../context/saleItem'
import { DataExcelContext } from '../context/dataExcel'
import ButtonDownloadSalesByMunicipality from '../components/buttonsDownload/ButtonDownloadSalesByMunicipality'
import ButtonDownloadSellerSalesByMunicipality from '../components/buttonsDownload/ButtonDownloadSellerSalesByMunicipality'
import ButtonDownloadSalesCustomerSellerByMunicipality from '../components/buttonsDownload/ButtonDownloadSalesCustomerSellerByMunicipality'
import TableDynamicDetailedSales from '../components/tables/TableDynamicDetailedSales'
import ButtonDownloadSalesProductSellerByMunicipality from '../components/buttonsDownload/ButtonDownloadSalesProductSellerByMunicipality'

const DetailedSalesPage = ({ splitName }) => {
  const { dateExcel } = useContext(DataExcelContext)
  const { sellerSalesData } = useContext(SaleItemContext)

  const sellerSalesProcessedData = sellerSalesData
    .filter(row => !row.producto.startsWith('Flete'))

  const getMonth = (date) => {
    const months = {
      0: 'Enero',
      1: 'Febrero',
      2: 'Marzo',
      3: 'Abril',
      4: 'Mayo',
      5: 'Junio',
      6: 'Julio',
      7: 'Agosto',
      8: 'Septiembre',
      9: 'Octubre',
      10: 'Noviembre',
      11: 'Diciembre'
    }

    const newDate = new Date(date)
    return months[newDate.getMonth()]
  }

  const getYear = (date) => {
    const newDate = new Date(date)
    return newDate.getFullYear()
  }

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Informe Detallado Ventas</h2>
        <span>{(dateExcel.dia !== undefined && dateExcel.mes !== undefined) ? (`Fecha de la última actualización: ${dateExcel.dia} de ${dateExcel.mes} de ${dateExcel.año}`) : ('Aun no hay informes cargados, por favor cargue los informes para tener una visualizacion de la data')}</span>
        <section className='button-group mt-4'>
          <ButtonDownloadSalesByMunicipality title='Descargar Ventas por Municipio' sellerSalesData={sellerSalesProcessedData} getMonth={getMonth} getYear={getYear} />
          <ButtonDownloadSellerSalesByMunicipality title='Descargar Ventas Vendedor por Municipio' sellerSalesData={sellerSalesProcessedData} getMonth={getMonth} getYear={getYear} />
          <ButtonDownloadSalesCustomerSellerByMunicipality title='Descargar Ventas Cliente Vendedor por Municipio' sellerSalesData={sellerSalesProcessedData} getMonth={getMonth} getYear={getYear} />
          <ButtonDownloadSalesProductSellerByMunicipality title='Descargar Ventas Producto Vendedor por Municipio' sellerSalesData={sellerSalesProcessedData} getMonth={getMonth} getYear={getYear} />
          <ButtonDownloadAnalytics title='Descargar Informe Macro' background='success' sellerSalesData={sellerSalesProcessedData} />
        </section>
        <hr />
        <section className='m-auto'>
          <TableDynamicDetailedSales sellerSalesData={sellerSalesProcessedData} getMonth={getMonth} getYear={getYear} />
        </section>
      </div>
    </div>
  )
}

export default DetailedSalesPage
