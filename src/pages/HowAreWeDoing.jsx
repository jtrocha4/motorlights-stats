import React, { useContext } from 'react'
import { DataContext } from '../components/context/data'
import ButtonDownloadExcel from '../components/ButtonDownloadExcel'
import ButtonDownloadIncentivePayout from '../components/ButtonDownloadIncentivePayout'
import ButtonUploadDb from '../components/ButtonUploadDb'
import Table from '../components/Table'

const HowAreWeDoing = ({ toFixed, postDataToApi, convertExcelDateToReadable, currencyFormat }) => {
  const { dateExcel, dataCost } = useContext(DataContext)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Como Vamos</h2>
        <p>{(dateExcel.dia !== undefined && dateExcel.mes !== undefined) ? (`Fecha de la última actualización: ${dateExcel.dia} de ${dateExcel.mes} de ${dateExcel.año}`) : ('Aun no hay informes cargados, por favor cargue los informes para tener una visualizacion de la data')}</p>
      </div>
      <div className='mt-4'>
        <div className='d-grid gap-2 d-md-flex justify-content-md-end mb-2'>
          <ButtonDownloadExcel
            title='Descargar informe' data={dataCost} toFixed={toFixed}
          />
          <ButtonDownloadIncentivePayout
            title='Descargar Liq. de incentivos' data={dataCost}
            convertExcelDateToReadable={convertExcelDateToReadable} errorRc={[]}
          />
          <ButtonUploadDb
            title='Guardar informacion' background='primary'
            data={dataCost}
            postDataToApi={postDataToApi}
          />
        </div>
        <div className='table-responsive'>
          <Table data={dataCost} currencyFormat={currencyFormat} toFixed={toFixed} />
        </div>
      </div>
    </div>
  )
}

export default HowAreWeDoing
