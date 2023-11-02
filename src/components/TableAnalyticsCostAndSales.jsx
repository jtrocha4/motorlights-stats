import React, { useContext, useEffect } from 'react'
import { SaleItemContext } from './context/saleItem'
import { DataContext } from './context/data'

const TableAnalyticsCostAndSales = ({ currencyFormat }) => {
  const { sellerSalesData, costAndSalesData, setCostAndSalesData } = useContext(SaleItemContext)
  const { data } = useContext(DataContext)

  const dataFlat = data.flatMap(({ venta }) => venta)
  //   const freights = sellerSalesData.filter(el => el.idProducto === '0001' || el.producto === 'Flete')

  const processCostAndSalesData = () => {
    const data = dataFlat.filter(el => el !== undefined).map((el) => {
      return sellerSalesData.filter(element => el.doc === element.doc && el.idProducto === element.idProducto)
        .map(element => {
          const { vendedor, cliente, ciudadCliente, departamentoCliente, valorTotal, fecha, categoriaProducto } = element
          return {
            vendedor,
            cliente,
            ciudadCliente,
            departamentoCliente,
            valorTotal,
            fecha,
            categoriaProducto,
            venta: el.ventas,
            costo: el.totalCosto
          }
        }).flat()
    }).flat()
    setCostAndSalesData(data)
  }

  useEffect(() => {
    processCostAndSalesData()
  }, [data, sellerSalesData])

  return (
    <table className='table table-hover'>
      <thead>
        <tr>
          <th>Vendedor</th>
          <th>Cliente</th>
          <th>Flete</th>
          <th>Municipio</th>
          <th>Departamento</th>
          <th>Total Ventas</th>
          <th>Mes</th>
          <th>Categoria</th>
          <th>Ventas</th>
          <th>Costos</th>
        </tr>
      </thead>
      <tbody className='table-group-divider'>
        {
            // sellerSalesData.map((element, index) => (
            //   <tr key={index}>
            //     <td>{element.vendedor}</td>
            //     <td>{element.cliente}</td>
            //     <td>flete</td>
            //     <td>{element.ciudadCliente}</td>
            //     <td>{element.departamentoCliente}</td>
            //     <td>{currencyFormat(element.valorTotal)}</td>
            //     <td>Mes</td>
            //     <td>{element.categoriaProducto}</td>
            //   </tr>
            // ))

            costAndSalesData.map((element, index) => (
              <tr key={index}>
                <td>{element.vendedor}</td>
                <td>{element.cliente}</td>
                <td>{currencyFormat(element.flete)}</td>
                <td>{element.ciudadCliente}</td>
                <td>{element.departamentoCliente}</td>
                <td>{currencyFormat(element.valorTotal)}</td>
                <td>{element.fecha}</td>
                <td>{element.categoriaProducto}</td>
                <td>{currencyFormat(element.venta)}</td>
                <td>{currencyFormat(element.costo)}</td>
              </tr>
            ))
        }
      </tbody>
    </table>
  )
}

export default TableAnalyticsCostAndSales
