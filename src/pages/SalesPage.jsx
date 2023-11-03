import React, { useContext } from 'react'
import ButtonDownloadExcel from '../components/ButtonDownloadExcel'
import { DataContext } from '../components/context/data'
import ButtonDownloadIncentivePayout from '../components/ButtonDownloadIncentivePayout'
import ButtonDownloadDetailSaleAndCollection from '../components/ButtonDownloadDetailSaleAndCollection'
import { FiltersProvider } from '../components/context/filters'
import SimpleBarCharts from '../components/charts/SimpleBarCharts'

const SalesPage = ({ toFixed, postSellerPerformanceToApi, sellers, convertExcelDateToReadable, currencyFormat, sellerPerformance, extractDateFromData }) => {
  const { dateExcel, data } = useContext(DataContext)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Informes de Ventas</h2>
        <span>{(dateExcel.dia !== undefined && dateExcel.mes !== undefined) ? (`Fecha de la última actualización: ${dateExcel.dia} de ${dateExcel.mes} de ${dateExcel.año}`) : ('Aun no hay informes cargados, por favor cargue los informes para tener una visualizacion de la data')}</span>
        <section className='button-group mt-4'>
          <ButtonDownloadExcel
            title='Descargar Inf. Como Vamos' data={data} toFixed={toFixed}
          />
          <ButtonDownloadIncentivePayout
            title='Descargar Inf. Liq. de incentivos' data={data}
            convertExcelDateToReadable={convertExcelDateToReadable} errorRc={[]}
          />
          <ButtonDownloadDetailSaleAndCollection
            title='Descargar Inf. Detalle Ventas y Recaudo' data={data}
            convertExcelDateToReadable={convertExcelDateToReadable} errorRc={[]}
          />
        </section>
        <section className='mt-5'>
          <h3>Rendimiento de ventas</h3>
          <div className='mt-2'>
            <FiltersProvider>
              <SimpleBarCharts sellerPerformance={sellerPerformance} extractDateFromData={extractDateFromData} />
            </FiltersProvider>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SalesPage
