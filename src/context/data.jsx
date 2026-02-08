import { createContext, useState } from 'react'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([])
  const [dataCollection, setDataCollection] = useState([])
  const [dataAuxiliaryBook, setDataAuxiliaryBook] = useState([])
  const [totalDebitByDocNum, setTotalDebitByDocNum] = useState({})
  const [errorRc, setErrorRc] = useState([])

  const [dataPortfolio, setDataPortfolio] = useState([])
  const [portfolioBehavior, setPortfolioBehavior] = useState([])

  const [salesGoalBySeller, setSalesGoalBySeller] = useState({})
  const [collectionGoalBySeller, setCollectionGoalBySeller] = useState({})
  const [portfolioClientsGoals, setPortfolioClientsGoals] = useState({})

  const [sellers, setSellers] = useState([])

  const [inventoryTurnover, setInventoryTurnover] = useState([])

  // Hace referencia a los productos cargados a través del reporte de rotación de inventario
  const [newInventoryTurnover, setNewInventoryTurnover] = useState([])

  return (
    <DataContext.Provider value={{
      data,
      setData,
      dataCollection,
      setDataCollection,
      dataAuxiliaryBook,
      setDataAuxiliaryBook,
      totalDebitByDocNum,
      setTotalDebitByDocNum,
      errorRc,
      setErrorRc,
      dataPortfolio,
      setDataPortfolio,
      portfolioBehavior,
      setPortfolioBehavior,
      salesGoalBySeller,
      setSalesGoalBySeller,
      collectionGoalBySeller,
      setCollectionGoalBySeller,
      portfolioClientsGoals,
      setPortfolioClientsGoals,
      sellers,
      setSellers,
      inventoryTurnover,
      setInventoryTurnover,
      newInventoryTurnover,
      setNewInventoryTurnover
    }}
    >
      {children}
    </DataContext.Provider>
  )
}
