import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './components/context/data.jsx'
import { DateProvider } from './components/context/dateFile.jsx'
import { NewCustomerProvider } from './components/context/newCustomers.jsx'
import { SaleItemProvider } from './components/context/saleItem.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <DateProvider>
        <NewCustomerProvider>
          <SaleItemProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SaleItemProvider>
        </NewCustomerProvider>
      </DateProvider>
    </DataProvider>
  </React.StrictMode>
)
