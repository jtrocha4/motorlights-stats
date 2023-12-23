import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './context/data.jsx'
import { NewCustomerProvider } from './context/newCustomers.jsx'
import { SaleItemProvider } from './context/saleItem.jsx'
import { ReportDetailsProvider } from './context/reportDetails.jsx'
import { ThirdPartiesProvider } from './context/thirdParties.jsx'
import { DataExcelProvider } from './context/dataExcel.jsx'
import { ProductProvider } from './context/product.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataExcelProvider>
      <DataProvider>
        <ReportDetailsProvider>
          <NewCustomerProvider>
            <SaleItemProvider>
              <ThirdPartiesProvider>
                <ProductProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </ProductProvider>
              </ThirdPartiesProvider>
            </SaleItemProvider>
          </NewCustomerProvider>
        </ReportDetailsProvider>
      </DataProvider>
    </DataExcelProvider>
  </React.StrictMode>
)
