import { createContext, useState } from 'react'

export const SaleItemContext = createContext()

export const SaleItemProvider = ({ children }) => {
  const [excelDataSaleItem, setExcelDataSaleItem] = useState([])
  const [dataSaleItem, setDataSaleItem] = useState([])
  const [sellersCustomers, setSellersCustomers] = useState([])

  const [sellerSalesData, setSellerSalesData] = useState([])

  return (
    <SaleItemContext.Provider value={{
      excelDataSaleItem, setExcelDataSaleItem, dataSaleItem, setDataSaleItem, sellersCustomers, setSellersCustomers, sellerSalesData, setSellerSalesData
    }}
    >
      {children}
    </SaleItemContext.Provider>
  )
}
