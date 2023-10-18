import { createContext, useState } from 'react'

export const SaleItemContext = createContext()

export const SaleItemProvider = ({ children }) => {
  const [excelDataSaleItem, setExcelDataSaleItem] = useState([])
  const [dataSaleItem, setDataSaleItem] = useState([])
  const [sellersCustomers, setSellersCustomers] = useState([])

  return (
    <SaleItemContext.Provider value={{
      excelDataSaleItem, setExcelDataSaleItem, dataSaleItem, setDataSaleItem, sellersCustomers, setSellersCustomers
    }}
    >
      {children}
    </SaleItemContext.Provider>
  )
}
