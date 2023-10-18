import { createContext, useState } from 'react'

export const ReportDetailsContext = createContext()

export const ReportDetailsProvider = ({ children }) => {
  const [costReportName, setCostReportName] = useState([])
  const [collectionReportName, setCollectionReportName] = useState([])
  const [auxiliaryBookReportName, setAuxiliaryBookReportName] = useState([])
  const [salesItemsReportName, setSalesItemsReportName] = useState([])
  const [thirdPartiesReportName, setThirdPartiesReportName] = useState([])

  const [dateCostFile, setDateCostFile] = useState([])
  const [dateCollectionFile, setDateCollectionFile] = useState([])
  const [dateAuxiliaryBookFile, setDateAuxiliaryBookFile] = useState([])
  const [dateSaleItemFile, setDateSaleItemFile] = useState([])

  return (
    <ReportDetailsContext.Provider value={{
      costReportName,
      setCostReportName,
      collectionReportName,
      setCollectionReportName,
      auxiliaryBookReportName,
      setAuxiliaryBookReportName,
      salesItemsReportName,
      setSalesItemsReportName,
      thirdPartiesReportName,
      setThirdPartiesReportName,

      dateCostFile,
      setDateCostFile,
      dateCollectionFile,
      setDateCollectionFile,
      dateAuxiliaryBookFile,
      setDateAuxiliaryBookFile,
      dateSaleItemFile,
      setDateSaleItemFile
    }}
    >
      {children}
    </ReportDetailsContext.Provider>
  )
}
