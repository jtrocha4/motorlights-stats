import React from 'react'

const Table = ({ headers, data, currencyFormat }) => {
  console.log(data)
  return (
    <>
      <table className='table table-hover'>
        <thead>
          <tr>
            {
                headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))
            }
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {
            (data.length === 0)
              ? (<tr><td colSpan={11} className='text-center'>No hay datos para mostrar, por favor cargue todos los informes</td></tr>)
              : (
                  data.map(({ vendedor, totalVenta, cantidadFacturas, promedioVentas, metaVentas, porcentajeVentas, metaVentasPendiente, totalRecaudo, metaRecaudoSinIva, porcentajeRecaudo, recaudoPendiente }, index) => (
                    <tr key={index}>
                      <td>{vendedor}</td>
                      <td>{currencyFormat(totalVenta)}</td>
                      <td>{cantidadFacturas}</td>
                      <td>{currencyFormat(promedioVentas)}</td>
                      <td className='table-dark'>{currencyFormat(metaVentas)}</td>
                      <td>{porcentajeVentas}</td>
                      <td>{currencyFormat(metaVentasPendiente)}</td>
                      <td>{currencyFormat(totalRecaudo)}</td>
                      <td className='table-dark'>{currencyFormat(metaRecaudoSinIva)}</td>
                      <td>{porcentajeRecaudo}</td>
                      <td>{currencyFormat(recaudoPendiente)}</td>
                    </tr>
                  ))
                )
          }
        </tbody>
      </table>
    </>
  )
}

export default Table
