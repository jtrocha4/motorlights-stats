import { createContext, useState } from 'react'

export const SaleItemContext = createContext()

export const SaleItemProvider = ({ children }) => {
  const [excelDataSaleItem, setExcelDataSaleItem] = useState([])

  return (
    <SaleItemContext.Provider value={{
      excelDataSaleItem, setExcelDataSaleItem
    }}
    >
      {children}
    </SaleItemContext.Provider>
  )
}
