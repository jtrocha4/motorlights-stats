import React, { useContext, useEffect } from 'react'
import { DataContext } from './context/data'
import { FiltersContext } from './context/filters'

const Filters = ({ splitName }) => {
  const { seller } = useContext(DataContext)
  const { filters, setFilters } = useContext(FiltersContext)

  const handleCheck = (event) => {
    const { name, checked } = event.target

    if (name === 'all') {
      if (checked) {
        setFilters({ seller: seller.map(el => el.id) })
      } else {
        setFilters({ seller: [] })
      }
    } else {
      if (checked) {
        setFilters({ seller: [...filters.seller, name] })
      } else {
        setFilters({ seller: filters.seller.filter(id => id !== name) })
      }
    }
  }

  useEffect(() => {
    setFilters({ seller: seller.map(el => el.id) })
  }, [seller])

  return (
    <div className='dropdown'>
      <button className='form-select' type='button' data-bs-toggle='dropdown' aria-expanded='false'>
        Vendedor
      </button>
      <div className='dropdown-menu'>
        <div className='form-check'>
          <input className='form-check-input' type='checkbox' name='all' id='all' checked={filters.seller.length === seller.length} onChange={handleCheck} />
          <label className='form-check-label' htmlFor='all'>
            Todos
          </label>
          {seller.map((el) => (
            <div key={el.id}>
              <input
                className='form-check-input'
                type='checkbox'
                name={el.id}
                id={el.id}
                checked={filters.seller.includes(el.id)}
                onChange={handleCheck}
              />
              <label className='form-check-label' htmlFor={el.id}>
                {splitName(el.nombre)}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Filters
