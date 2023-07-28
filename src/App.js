import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { AppProvider } from './AppContext';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import PelangganPage from './pages/Pelanggan';
import TagihanPage from './pages/Tagihan';
import PenggunaanPage from './pages/Penggunaan';
import PembayaranPage from './pages/Pembayaran';

const App = () => {
  const [user, setUser] = useState('');
  const [customerId, setCustomerId] = useState('');
  return (
    <AppProvider user={user}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage setUser={setUser} setCustomerId={setCustomerId} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} setCustomerId={setCustomerId} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage user={user} customerId={customerId} />} />
          <Route path="/pelanggan" element={<PelangganPage user={user} customerId={customerId} />} />
          <Route path="/penggunaan" element={<PenggunaanPage user={user} customerId={customerId} />} />
          <Route path="/tagihan" element={<TagihanPage user={user} customerId={customerId} />} />
          <Route path="/pembayaran" element={<PembayaranPage user={user} customerId={customerId} />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
