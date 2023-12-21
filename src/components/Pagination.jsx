import React from 'react'

const Pagination = ({ page, setPage, maximum }) => {
  const nextPage = () => {
    if (page < maximum) {
      setPage(parseInt(page) + 1)
    }
  }

  const previousPage = () => {
    if (page > 1) {
      setPage(parseInt(page) - 1)
    }
  }

  const handleChange = (event) => {
    const value = event.target.value
    if (value < 1) {
      return setPage(parseInt(1))
    }
    if (value > maximum) {
      return setPage(parseInt(maximum))
    }
    setPage(value)
  }

  return (
    <nav aria-label='Page navigation example'>
      <ul className='pagination justify-content-center'>
        <li className='page-item'>
          <a className='page-link' role='button' onClick={previousPage}>Anterior</a>
        </li>
        <li className='page-item'><input type='text' className='page-link' value={page} onChange={handleChange} max={maximum} /></li>
        <li className='page-item'><span className='page-link'>de {maximum}</span></li>
        <li className='page-item'>
          <a className='page-link' role='button' onClick={nextPage}>Siguiente</a>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
