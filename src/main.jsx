import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './components/context/data.jsx'
import { NewCustomerProvider } from './components/context/newCustomers.jsx'
import { SaleItemProvider } from './components/context/saleItem.jsx'
import { ThirdPartiesProvider } from './components/context/thirdParties.jsx'
import { ReportDetailsProvider } from './components/context/reportDetails.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <ReportDetailsProvider>
        <NewCustomerProvider>
          <SaleItemProvider>
            <ThirdPartiesProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ThirdPartiesProvider>
          </SaleItemProvider>
        </NewCustomerProvider>
      </ReportDetailsProvider>
    </DataProvider>
  </React.StrictMode>
)
