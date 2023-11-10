import React, { useState } from 'react'

const TableAnalytics = ({ sellerSalesData, currencyFormat }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 20

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const totalPages = Math.ceil(sellerSalesData.length / itemsPerPage)

  const pagination = () => {
    const currentItems = sellerSalesData.slice(startIndex, endIndex)
    return currentItems
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div>
      <nav aria-label='Page navigation' className='pagination-buttons'>
        <ul className='pagination'>
          <li className='page-item'><a type='button' className='page-link' onClick={previousPage}><i className='fa-solid fa-chevron-left' /> Anterior</a></li>
          <li className='page-item'><p className='page-link'>{currentPage}</p></li>
          <li className='page-item'><a type='button' className='page-link' onClick={nextPage}>Siguiente <i className='fa-solid fa-chevron-right' /></a></li>
        </ul>
      </nav>
      <table className='table table-hover' id='table-analytics'>
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Documento</th>
            <th>Fecha</th>
            <th>ID Tercero</th>
            <th>Tercero</th>
            <th>Municipio</th>
            <th>Departamento</th>
            <th>ID Producto</th>
            <th>Producto</th>
            <th>Categoria Producto</th>
            <th>Unidades</th>
            <th>Valor unitario</th>
            <th>Venta bruta</th>
            <th>Descuento</th>
            <th>Venta Neta</th>
            <th>IVA</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {
            (sellerSalesData.length === 0)
              ? (<tr><td colSpan={17} className='text-center'>No hay datos para mostrar, por favor cargue todos los informes</td></tr>)
              : (
                  pagination().map((el, index) => (
                    <tr key={index}>
                      <td> {el.vendedor}</td>
                      <td>{el.doc}</td>
                      <td>{el.fecha}</td>
                      <td>{el.idCliente}</td>
                      <td>{el.cliente}</td>
                      <td>{el.ciudadCliente}</td>
                      <td>{el.departamentoCliente}</td>
                      <td>{el.idProducto}</td>
                      <td>{el.producto}</td>
                      <td>{el.categoriaProducto}</td>
                      <td>{el.unidadesProducto}</td>
                      <td>{currencyFormat(el.valorUnitario)}</td>
                      <td>{currencyFormat(el.ventaBruta)}</td>
                      <td>{currencyFormat(el.descuento)}</td>
                      <td>{currencyFormat(el.ventaNeta)}</td>
                      <td>{currencyFormat(el.iva)}</td>
                      <td>{currencyFormat(el.valorTotal)}</td>
                    </tr>
                  ))
                )
          }
        </tbody>
      </table>
    </div>
  )
}

export default TableAnalytics
