import { createContext, useState } from 'react'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [dataCost, setDataCost] = useState([])
  const [dataCollection, setDataCollection] = useState([])
  const [dataAuxiliaryBook, setDataAuxiliaryBook] = useState([])
  const [totalDebitByDocNum, setTotalDebitByDocNum] = useState({})
  const [errorRc, setErrorRc] = useState([])

  // Hacer un contexto independiente solo par alos excelData (?
  const [excelDataCost, setExcelDataCost] = useState([])
  const [excelDataCollection, setExcelDataCollection] = useState([])
  const [excelDataAuxiliaryBook, setExcelDataAuxiliaryBook] = useState([])

  const [salesGoalBySeller, setSalesGoalBySeller] = useState({})
  const [collectionGoalBySeller, setCollectionGoalBySeller] = useState({})

  const [dateExcel, setDateExcel] = useState({})

  return (
    <DataContext.Provider value={{
      excelDataCost,
      setExcelDataCost,
      excelDataCollection,
      setExcelDataCollection,
      excelDataAuxiliaryBook,
      setExcelDataAuxiliaryBook,
      dataCost,
      setDataCost,
      dataCollection,
      setDataCollection,
      dataAuxiliaryBook,
      setDataAuxiliaryBook,
      totalDebitByDocNum,
      setTotalDebitByDocNum,
      errorRc,
      setErrorRc,
      salesGoalBySeller,
      setSalesGoalBySeller,
      collectionGoalBySeller,
      setCollectionGoalBySeller,
      dateExcel,
      setDateExcel
    }}
    >
      {children}
    </DataContext.Provider>
  )
}
