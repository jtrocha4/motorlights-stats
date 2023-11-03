import React, { useContext } from 'react'
import { DataContext } from '../components/context/data'

const DetailedSalesPage = () => {
  const { dateExcel } = useContext(DataContext)
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Informe Detallado Ventas</h2>
        <span>{(dateExcel.dia !== undefined && dateExcel.mes !== undefined) ? (`Fecha de la última actualización: ${dateExcel.dia} de ${dateExcel.mes} de ${dateExcel.año}`) : ('Aun no hay informes cargados, por favor cargue los informes para tener una visualizacion de la data')}</span>
      </div>
    </div>
  )
}

export default DetailedSalesPage
