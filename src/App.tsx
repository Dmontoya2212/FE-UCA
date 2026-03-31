
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '@components/Header/Header.tsx';
import NavBar from '@components/NavBar/NavBar.tsx';
import Home from '@pages/Home/Home.tsx';
import Servicios from '@pages/Servicios/Servicios.tsx';
import Clintes from '@pages/Clientes/Clientes.tsx';
import Facturas from '@pages/Facturas/Facturas.tsx';
import '@pages/Home/Home.css';

type NavKey = 'dashboard' | 'clientes' | 'servicios' | 'facturas';

export default function App() {
  const [active, setActive] = useState<NavKey>('dashboard');
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
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path={'/clientes'} element={<Clintes />} />
        <Route path={'/facturas'} element={<Facturas />} />
      </Routes>
    </main>
  );
}

