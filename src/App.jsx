import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard.jsx';
import SalesJournal from './components/SalesJournal.jsx';
import InitialData from './assets/pos_item.json';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [products, setProducts] = useState(InitialData);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('pos_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pos_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTrans) => {
    setTransactions(prev => [...prev, { id: Date.now(), ...newTrans }]);
  };

  const handleReset = () => {
    if (window.confirm('IMPORTANT: Are you sure you want to delete all history? This cannot be undone.')) {
      localStorage.removeItem('pos_transactions');
      localStorage.removeItem('pos_products');
      window.location.reload();
    }
  };



  return (
    <div className="app">
      <header className="header">
        <h1>Basic Point of Sale System</h1>
        <nav>
          <button onClick={() => setCurrentPage('Dashboard')}>Dashboard</button>
          <button onClick={() => setCurrentPage('SalesJournal')}>Sales Journal</button>
          <button onClick={handleReset} style={{ color: 'red' }}>Reset</button>
        </nav>
      </header>
      <main>
        {currentPage === 'Dashboard'
          ? <Dashboard transactions={transactions} products={products} />
          : <SalesJournal transactions={transactions} addTransaction={addTransaction} products={products} />
        }
      </main>
    </div>
  )
}

export default App
