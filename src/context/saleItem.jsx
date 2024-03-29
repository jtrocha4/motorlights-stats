import { createContext, useState } from 'react'

export const SaleItemContext = createContext()

export const SaleItemProvider = ({ children }) => {
  const [dataSaleItem, setDataSaleItem] = useState([])
  const [sellersCustomers, setSellersCustomers] = useState([])
  const [sellerSalesData, setSellerSalesData] = useState([])
  const [costAndSalesData, setCostAndSalesData] = useState([])

  return (
    <SaleItemContext.Provider value={{
      dataSaleItem, setDataSaleItem, sellersCustomers, setSellersCustomers, sellerSalesData, setSellerSalesData, costAndSalesData, setCostAndSalesData
    }}
    >
      {children}
    </SaleItemContext.Provider>
  )
}
