import { createContext, useState } from 'react'

export const ThirdPartiesContext = createContext()

export const ThirdPartiesProvider = ({ children }) => {
  const [thirdPartiesData, setThirdPartiesData] = useState([])
  const [customer, setCustomer] = useState([])

  return (
    <ThirdPartiesContext.Provider value={{
      thirdPartiesData,
      setThirdPartiesData,
      customer,
      setCustomer
    }}
    >
      {children}
    </ThirdPartiesContext.Provider>
  )
}
