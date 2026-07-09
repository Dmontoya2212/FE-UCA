
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '@components/Header/Header.tsx';
import NavBar from '@components/NavBar/NavBar.tsx';
import Home from '@pages/Home/Home.tsx';
import Empresa from '@pages/Empresa/Empresa.tsx';
import Servicios from '@pages/Servicios/Servicios.tsx';
import Clintes from '@pages/Clientes/Clientes.tsx';
import Facturas from '@pages/Facturas/Facturas.tsx';
import Login from './pages/Login/Login.tsx';
import { EmpresaProvider } from '@context/EmpresaContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import '@pages/Home/Home.css';

type NavKey = 'dashboard' | 'empresa' | 'clientes' | 'servicios' | 'facturas';

function AppContent() {
  const [active, setActive] = useState<NavKey>('dashboard');
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <main className={`home`}>
      <Header
        title="Sistema de Facturación Electrónica"
        subtitle="Gestiona tus facturas de forma simple y profesional"
      />

      <div className="home__nav">
        <NavBar active={active} onChange={setActive} />
      </div>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/empresa" element={<ProtectedRoute><Empresa /></ProtectedRoute>} />
        <Route path="/servicios" element={<ProtectedRoute><Servicios /></ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute><Clintes /></ProtectedRoute>} />
        <Route path="/facturas" element={<ProtectedRoute><Facturas /></ProtectedRoute>} />
        <Route path="*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EmpresaProvider>
        <AppContent />
      </EmpresaProvider>
    </AuthProvider>
  );
}

