import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './components/context/data.jsx'
import { DateProvider } from './components/context/dateFile.jsx'
import { NewCustomerProvider } from './components/context/newCustomers.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <DataProvider>
    <DateProvider>
      <NewCustomerProvider>
        {/* <React.StrictMode> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
        {/* </React.StrictMode> */}
      </NewCustomerProvider>
    </DateProvider>
  </DataProvider>
)
