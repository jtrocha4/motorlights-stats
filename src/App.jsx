import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App () {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className='flex'>
        <div className='container'>
          <h2>Inicio</h2>
        </div>
      </div>
    </>
  )
}

export default App
