import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './components/Dashboard.jsx';
import SalesJournal from './components/SalesJournal.jsx';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="journal" element={<SalesJournal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;

