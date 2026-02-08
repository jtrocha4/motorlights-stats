import { createContext, useState } from 'react'

export const DataExcelContext = createContext()

export const DataExcelProvider = ({ children }) => {
  const [dateExcel, setDateExcel] = useState({})
  const [excelDataCost, setExcelDataCost] = useState([])
  const [excelDataCollection, setExcelDataCollection] = useState([])
  const [excelDataAuxiliaryBook, setExcelDataAuxiliaryBook] = useState([])

  const [excelDataNewCustomers, setExcelDataNewCustomers] = useState([])
  const [excelDataSaleItem, setExcelDataSaleItem] = useState([])
  const [excelDataThirdParties, setExcelDataThirdParties] = useState([])
  const [excelDataCreditAndPortfolio, setExcelDataCreditAndPortfolio] = useState([])

  const [excelDataInventoryTurnover, setExcelDataInventoryTurnover] = useState([])

  return (
    <DataExcelContext.Provider value={{
      dateExcel,
      setDateExcel,
      excelDataCost,
      setExcelDataCost,
      excelDataCollection,
      setExcelDataCollection,
      excelDataAuxiliaryBook,
      setExcelDataAuxiliaryBook,
      excelDataNewCustomers,
      setExcelDataNewCustomers,
      excelDataSaleItem,
      setExcelDataSaleItem,
      excelDataThirdParties,
      setExcelDataThirdParties,
      excelDataCreditAndPortfolio,
      setExcelDataCreditAndPortfolio,
      excelDataInventoryTurnover,
      setExcelDataInventoryTurnover
    }}
    >
      {children}
    </DataExcelContext.Provider>
  )
}
