import { useState, createContext } from 'react'

export const FiltersContext = createContext()

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    seller: []
  })
  return (
    <FiltersContext.Provider value={{
      filters, setFilters
    }}
    >
      {children}
    </FiltersContext.Provider>
  )
}
