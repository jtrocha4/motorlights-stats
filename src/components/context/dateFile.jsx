import { createContext, useState } from 'react'

export const DateContext = createContext()

export const DateProvider = ({ children }) => {
  const [dateCostFile, setDateCostFile] = useState([])
  const [dateCollectionFile, setDateCollectionFile] = useState([])
  const [dateAuxiliaryBookFile, setDateAuxiliaryBookFile] = useState([])

  return (
    <DateContext.Provider value={{
      dateCostFile,
      setDateCostFile,
      dateCollectionFile,
      setDateCollectionFile,
      dateAuxiliaryBookFile,
      setDateAuxiliaryBookFile
    }}
    >
      {children}
    </DateContext.Provider>
  )
}
