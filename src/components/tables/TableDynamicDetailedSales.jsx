import React, { useState } from 'react'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'

const TableDynamicDetailedSales = ({ sellerSalesData }) => {
  const [pivotState, setPivotState] = useState({})

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

  const sellerSalesProcessedData = sellerSalesData.map(row => ({
    Departamento: row.departamentoCliente,
    Mes: getMonth(row.fecha),
    Año: getYear(row.fecha),
    Municipio: row.ciudadCliente,
    Vendedor: row.vendedor,
    'Venta Neta': row.ventaNeta,
    Cliente: `${row.idCliente} ${row.cliente}`,
    Producto: `${row.idProducto} ${row.producto}`,
    'Categoria Producto': row.categoriaProducto
  }))

  const handlePivotState = (event) => {
    const id = event.target.id
    if (id === 'venta-municipio') {
      setPivotState({
        rows: ['Departamento', 'Municipio'],
        cols: ['Mes']
      })
    }
    if (id === 'venta-vendedor-municipio') {
      setPivotState({
        rows: ['Vendedor', 'Departamento', 'Municipio'],
        cols: ['Mes']
      })
    }
    if (id === 'venta-cliente-vendedor-municipio') {
      setPivotState({
        rows: ['Vendedor', 'Departamento', 'Municipio', 'Cliente'],
        cols: ['Mes']
      })
    }
    if (id === 'venta-producto-vendedor-municipio') {
      setPivotState({
        rows: ['Departamento', 'Municipio', 'Producto'],
        cols: ['Mes']
      })
    }
    if (id === 'reset-table') {
      setPivotState({})
    }
  }

  return (
    <>
      <div className='button-group'>
        <button type='button' id='venta-municipio' className='btn btn-dark' onClick={handlePivotState}>Ventas por Municipio</button>
        <button type='button' id='venta-vendedor-municipio' className='btn btn-dark' onClick={handlePivotState}>Ventas Vendedor por Municipio</button>
        <button type='button' id='venta-cliente-vendedor-municipio' className='btn btn-dark' onClick={handlePivotState}>Ventas Cliente Vendedor por Municipio</button>
        <button type='button' id='venta-producto-vendedor-municipio' className='btn btn-dark' onClick={handlePivotState}>Ventas Producto Vendedor por Municipio</button>
        <button type='button' id='reset-table' className='btn btn-info' onClick={handlePivotState}>Reiniciar Tabla</button>
      </div>
      <div className='table-responsive mt-4 pb-4'>
        <PivotTableUI
          aggregatorName='Sum'
          vals={['Venta Neta']}
          hiddenAttributes={['Venta Neta']}
          data={sellerSalesProcessedData}
          onChange={setPivotState}
          {...pivotState}
        />
      </div>
    </>
  )
}

export default TableDynamicDetailedSales
