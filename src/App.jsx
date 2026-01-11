import { useState } from 'react'
import Dashboard from './components/Dashboard'
import SalesJournal from './components/SalesJournal'
import './App.css'

function App() {
  const[currentPage, setCurrentPage] = useState('Dashboard');

  return (
    <div className='app'>
      <header className = 'header'>
       <h1>Basic Point of Sale System</h1>
       <nav>
          <button onClick={() => setCurrentPage('Dashboard')}>Dashboard</button>
          <button onClick={() => setCurrentPage('SalesJounral')}>Sales Journal</button>
       </nav>
      </header>
    </div>
  )
}

export default App
