import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from './context/data'

const TableAnalytics = ({ data, convertExcelDateToReadable, currencyFormat, toFixed }) => {
  const { excelDataCost } = useContext(DataContext)
  const [salesData, setSalesData] = useState([])

  const extractSalesFromData = (dataArray = []) => {
    const sales = dataArray.map(element => {
      if (element.venta !== undefined) {
        return element.venta.map(el => {
          const { ...restOfData } = el
          return {
            ...restOfData,
            vendedor: element.vendedor,
            unitarioVentas: toFixed(el.unitarioVentas),
            ventas: toFixed(el.ventas)
          }
        })
      }
      return []
    })
    setSalesData(sales)
  }

  console.log(salesData)

  useEffect(() => {
    extractSalesFromData(data)
  }, [excelDataCost])

  return (
    <div>
      <table className='table table-hover table-sm'>
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Documento</th>
            <th>Fecha</th>
            <th>Tercero</th>
            <th>Producto</th>
            <th>Unidades</th>
            <th>Valor unitario</th>
            <th>Venta bruta</th>
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {
            (data.length === 0)
              ? (<tr><td colSpan={8} className='text-center'>No hay datos para mostrar, por favor cargue todos los informes</td></tr>)
              : (
                // <tr><td colSpan={4} className='text-center'>Hay datos</td></tr>
                  salesData.flatMap((subArray, index) =>
                    subArray.map((el, subIndex) => (
                      <tr key={index * 1000 + subIndex}>
                        <td> {el.vendedor}</td>
                        <td>{el.doc}</td>
                        <td>{convertExcelDateToReadable(el.fecha)}</td>
                        <td>{el.cliente}</td>
                        <td>{el.codigoInventario}</td>
                        <td>{el.unidades}</td>
                        <td>{currencyFormat(el.unitarioVentas)}</td>
                        <td>{currencyFormat(el.ventas)}</td>
                      </tr>
                    ))
                  )
                )
          }
        </tbody>
      </table>
    </div>
  )
}

export default TableAnalytics
