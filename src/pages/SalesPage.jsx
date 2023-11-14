import React, { useContext } from 'react'
import ButtonDownloadIncentivePayout from '../components/buttonsDownload/ButtonDownloadIncentivePayout'
import ButtonDownloadDetailSaleAndCollection from '../components/buttonsDownload/ButtonDownloadDetailSaleAndCollection'
import ButtonDownloadExcel from '../components/buttonsDownload/ButtonDownloadExcel'
import { FiltersProvider } from '../context/filters'
import SimpleBarCharts from '../charts/SimpleBarCharts'
import { DataExcelContext } from '../context/dataExcel'
import { DataContext } from '../context/data'

const SalesPage = ({ toFixed, postSellerPerformanceToApi, convertExcelDateToReadable, sellerPerformance, extractDateFromData, splitName }) => {
  const { data } = useContext(DataContext)
  const { dateExcel } = useContext(DataExcelContext)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Informes de Ventas</h2>
        <span>{(dateExcel.dia !== undefined && dateExcel.mes !== undefined) ? (`Fecha de la última actualización: ${dateExcel.dia} de ${dateExcel.mes} de ${dateExcel.año}`) : ('Aun no hay informes cargados, por favor cargue los informes para tener una visualizacion de la data')}</span>
        <section className='button-group mt-4'>
          <ButtonDownloadExcel
            title='Descargar Inf. Como Vamos' data={data} toFixed={toFixed} splitName={splitName}
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
