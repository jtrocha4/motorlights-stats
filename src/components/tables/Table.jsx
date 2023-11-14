import React from 'react'

const Table = ({ data, currencyFormat, toFixed }) => {
  const grandTotal = (data) => {
    const grandTotal = {
      sales: 0,
      amountBills: 0,
      averageSales: 0,
      goalSales: 0,
      percentageSales: 0,
      pendingGoalSales: 0,

      collection: 0,
      collectionTarget: 0,
      percentageCollection: 0,
      pendingCollectionGoal: 0
    }
    data.forEach(element => {
      grandTotal.sales += element.totalVenta
      grandTotal.amountBills += element.cantidadFacturas
      grandTotal.averageSales = grandTotal.sales / grandTotal.amountBills
      grandTotal.goalSales += element.metaVentas
      grandTotal.pendingGoalSales += element.ventasPendiente
      grandTotal.percentageSales = 100 - (grandTotal.pendingGoalSales * 100) / grandTotal.goalSales

      grandTotal.collection += element.totalRecaudo
      grandTotal.collectionTarget += element.metaRecaudoSinIva
      grandTotal.pendingCollectionGoal += element.recaudoPendiente
      grandTotal.percentageCollection = 100 - (grandTotal.pendingCollectionGoal * 100) / grandTotal.collectionTarget

      // Aproximacion
      grandTotal.percentageSales = toFixed(grandTotal.percentageSales, 1)
      grandTotal.percentageCollection = toFixed(grandTotal.percentageCollection, 1)
    })
    return grandTotal
  }

  const { sales, amountBills, averageSales, goalSales, percentageSales, pendingGoalSales, collection, collectionTarget, percentageCollection, pendingCollectionGoal } = grandTotal(data)

  return (
    <>
      <table className='table table-hover table-sm'>
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Total ventas</th>
            <th>Cantidad de facturas</th>
            <th>Promedio de ventas</th>
            <th>Meta de ventas</th>
            <th>Porcentaje de ventas</th>
            <th>Ventas pendientes</th>
            <th>Recaudo</th>
            <th>Meta recaudo sin iva</th>
            <th>Porcentaje de recaudo</th>
            <th>Recaudo pendiente</th>
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {
            (data.length === 0)
              ? (<tr><td colSpan={11} className='text-center'>No hay datos para mostrar, por favor cargue todos los informes</td></tr>)
              : (
                  data.map(({ vendedor, totalVenta, cantidadFacturas, promedioVentas, metaVentas, porcentajeVentas, ventasPendiente, totalRecaudo, metaRecaudoSinIva, porcentajeRecaudo, recaudoPendiente }, index) => (
                    <tr key={index}>
                      <td>{vendedor}</td>
                      <td>{currencyFormat(totalVenta)}</td>
                      <td>{cantidadFacturas}</td>
                      <td>{currencyFormat(promedioVentas)}</td>
                      <td>{currencyFormat(metaVentas)}</td>
                      <td>{porcentajeVentas}%</td>
                      <td>{currencyFormat(ventasPendiente)}</td>
                      <td>{currencyFormat(totalRecaudo)}</td>
                      <td>{currencyFormat(metaRecaudoSinIva)}</td>
                      <td>{porcentajeRecaudo}%</td>
                      <td>{currencyFormat(recaudoPendiente)}</td>
                    </tr>
                  ))
                )
          }
          <tr className='table-warning'>
            <td><strong>Total general</strong></td>
            <td><strong>{currencyFormat(sales)}</strong></td>
            <td><strong>{amountBills}</strong></td>
            <td><strong>{currencyFormat(averageSales)}</strong></td>
            <td><strong>{currencyFormat(goalSales)}</strong></td>
            <td><strong>{percentageSales}%</strong></td>
            <td><strong>{currencyFormat(pendingGoalSales)}</strong></td>
            <td><strong>{currencyFormat(collection)}</strong></td>
            <td><strong>{currencyFormat(collectionTarget)}</strong></td>
            <td><strong>{percentageCollection}%</strong></td>
            <td><strong>{currencyFormat(pendingCollectionGoal)}</strong></td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default Table