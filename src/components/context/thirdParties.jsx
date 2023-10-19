import { createContext, useState } from 'react'

export const ThirdPartiesContext = createContext()

export const ThirdPartiesProvider = ({ children }) => {
  const [excelDataThirdParties, setExcelDataThirdParties] = useState([])

  const [thirdPartiesData, setThirdPartiesData] = useState([])

  const [customerData, setCustomerData] = useState([])

  return (
    <ThirdPartiesContext.Provider value={{
      excelDataThirdParties,
      setExcelDataThirdParties,
      thirdPartiesData,
      setThirdPartiesData,
      customerData,
      setCustomerData
    }}
    >
      {children}
    </ThirdPartiesContext.Provider>
  )
}
