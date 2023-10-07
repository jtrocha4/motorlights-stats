import { createContext, useState } from 'react'

export const DateContext = createContext()

export const DateProvider = ({ children }) => {
  const [costReportName, setCostReportName] = useState([])

  const [dateCostFile, setDateCostFile] = useState([])
  const [dateCollectionFile, setDateCollectionFile] = useState([])
  const [dateAuxiliaryBookFile, setDateAuxiliaryBookFile] = useState([])
  const [dateSaleItemFile, setDateSaleItemFile] = useState([])

  return (
    <DateContext.Provider value={{
      costReportName,
      setCostReportName,

      dateCostFile,
      setDateCostFile,
      dateCollectionFile,
      setDateCollectionFile,
      dateAuxiliaryBookFile,
      setDateAuxiliaryBookFile,
      dateSaleItemFile,
      setDateSaleItemFile
    }}
    >
      {children}
    </DateContext.Provider>
  )
}
