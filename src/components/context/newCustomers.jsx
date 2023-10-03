import { createContext, useState } from 'react'

export const NewCustomerContext = createContext()

export const NewCustomerProvider = ({ children }) => {
  const [excelDataNewCustomers, setExcelDataNewCustomers] = useState([])

  return (
    <NewCustomerContext.Provider value={{
      excelDataNewCustomers, setExcelDataNewCustomers
    }}
    >
      {children}
    </NewCustomerContext.Provider>
  )
}
