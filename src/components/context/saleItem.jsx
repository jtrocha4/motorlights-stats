import { createContext, useState } from 'react'

export const SaleItemContext = createContext()

export const SaleItemProvider = ({ children }) => {
  const [excelDataSaleItem, setExcelDataSaleItem] = useState([])
  const [dataSaleItem, setDataSaleItem] = useState([])

  return (
    <SaleItemContext.Provider value={{
      excelDataSaleItem, setExcelDataSaleItem, dataSaleItem, setDataSaleItem
    }}
    >
      {children}
    </SaleItemContext.Provider>
  )
}
