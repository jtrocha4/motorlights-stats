import { createContext, useState } from 'react'

export const NewCustomerContext = createContext()

export const NewCustomerProvider = ({ children }) => {
  const [excelDataNewCustomers, setExcelDataNewCustomers] = useState([])
  const [dataNewCustomers, setDataNewCustomers] = useState([])
  const [customersBySeller, setCustomersBySeller] = useState([])

  const extractId = (array) => {
    const regex = /\d+/
    const id = array.map(el => el.match(regex)[0])
    return id
  }

  const findNewClients = (dataSaleItem = [], dataNewCustomers = []) => {
    const customersBySeller = {}
    dataSaleItem.forEach(element => {
      dataNewCustomers.forEach(newCustomer => {
        const customerId = newCustomer.id
        const elementCustomerId = extractId(element.clientes)
        if (elementCustomerId.includes(customerId)) {
          const sellerName = element.vendedor
          if (customersBySeller[sellerName]) {
            customersBySeller[sellerName]++
          } else {
            customersBySeller[sellerName] = 1
          }
        }
      })
    })
    setCustomersBySeller(customersBySeller)
  }

  return (
    <NewCustomerContext.Provider value={{
      excelDataNewCustomers,
      setExcelDataNewCustomers,
      dataNewCustomers,
      setDataNewCustomers,
      customersBySeller,
      setCustomersBySeller,
      findNewClients
    }}
    >
      {children}
    </NewCustomerContext.Provider>
  )
}
