import { createContext, useState } from 'react'

export const NewCustomerContext = createContext()

export const NewCustomerProvider = ({ children }) => {
  const [dataNewCustomers, setDataNewCustomers] = useState([])
  const [customersBySeller, setCustomersBySeller] = useState([])

  return (
    <NewCustomerContext.Provider value={{
      dataNewCustomers,
      setDataNewCustomers,
      customersBySeller,
      setCustomersBySeller
    }}
    >
      {children}
    </NewCustomerContext.Provider>
  )
}
