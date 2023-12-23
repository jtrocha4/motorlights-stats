import React, { useContext, useState } from 'react'
import InputProduct from '../components/inputs/inputProduct'
import Pagination from '../components/Pagination'

import { ProductContext } from '../context/product'

const ManageProducts = ({ postProductToApi, removeExtraSpaces }) => {
  const { products } = useContext(ProductContext)

  const [page, setPage] = useState(1)
  const [elementsPerPage, setElementsPerPage] = useState(25)

  const maximum = Math.ceil(products.length / elementsPerPage)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Productos</h2>
        <section className='inputFile-group'>
          <InputProduct label='Informe de Productos' postProductToApi={postProductToApi} removeExtraSpaces={removeExtraSpaces} />
        </section>
        <section className='mt-4'>
          <Pagination page={page} setPage={setPage} maximum={maximum} />
          {
            products
              .filter(el => el.estado !== false)
              .slice((page - 1) * elementsPerPage, (page - 1) * elementsPerPage + elementsPerPage)
              .map(el => (
                <div className='card mt-3' key={el.id}>
                  <div className='card-body'>
                    <h5 className='card-title'>{el.nombre}</h5>
                    <h6 className='card-subtitle mb-2 text-body-secondary'>Categoría: {el.categoria}</h6>
                    <h6 className='card-subtitle mb-2 text-body-secondary'>Código Inventario: {el.codigo}</h6>
                  </div>

                </div>
              ))
          }
        </section>
      </div>
    </div>
  )
}

export default ManageProducts
