import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../components/Pagination'

const ManageInventoryTurnover = () => {
  const products = [
    {
      name: 'Bombillo Farola P15D M3 Ceramica (X10)(541)',
      id: '10771502201'
    },
    {
      name: 'Switche Antishock AZUL (606)',
      id: '18446010042'
    },
    {
      name: 'Bombillo Farola H4 Premium Smart ACDC 60V(39)',
      id: '10770401801'
    }
  ]

  const [page, setPage] = useState(1)
  const [elementsPerPage, setElementsPerPage] = useState(25)

  const maximum = Math.ceil(products.length / elementsPerPage)

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Gestionar Rotación de Inventario</h2>
        <section className='mt-4'>
          <Pagination page={page} setPage={setPage} maximum={maximum} />
          {
                products.map(el => (
                  <div className='card mt-3' key={el.id}>
                    <div className='card-body'>
                      <h5 className='card-title'>{el.name}</h5>
                      <h6 className='card-subtitle mb-2 text-body-secondary'>{el.id}</h6>
                    </div>
                  </div>
                ))
            }
        </section>
      </div>
    </div>
  )
}

export default ManageInventoryTurnover
