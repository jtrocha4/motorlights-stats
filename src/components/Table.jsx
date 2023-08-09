import React from 'react'

const Table = ({ headers, data, currencyFormat }) => {
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
              ? (<tr><td colSpan={7} className='text-center'>No hay datos para mostrar, por favor cargue todos los informes</td></tr>)
              : (
                  data.map(({ vendedor, ventasTotales, cantidadFacturas, promedioVentas, metaVentas, porcentajeVentas, metaVentasPendiente }, index) => (
                    <tr key={index}>
                      <td>{vendedor}</td>
                      <td>{currencyFormat(ventasTotales)}</td>
                      <td>{cantidadFacturas}</td>
                      <td>{currencyFormat(promedioVentas)}</td>
                      {/* <td>{currencyFormat(metaVentas)}</td> */}
                      <td>Meta ventas</td>
                      <td>{porcentajeVentas}</td>
                      <td>{currencyFormat(metaVentasPendiente)}</td>
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
