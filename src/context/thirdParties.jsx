import { createContext, useState } from 'react'

export const ThirdPartiesContext = createContext()

export const ThirdPartiesProvider = ({ children }) => {
  const [thirdPartiesData, setThirdPartiesData] = useState([])
  const [customers, setCustomers] = useState([])

  return (
    <ThirdPartiesContext.Provider value={{
      thirdPartiesData,
      setThirdPartiesData,
      customers,
      setCustomers
    }}
    >
      {children}
    </ThirdPartiesContext.Provider>
  )
}
