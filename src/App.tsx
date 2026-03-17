<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom';
import Home from '@pages/Home/Home.tsx';
import Servicios from '@pages/Servicios/Servicios.tsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/servicios" element={<Servicios />} />
    </Routes>
  );
}
=======
import Home from './pages/Home/Home';
//import Clientes from './pages/Clientes/Clientes';

export default function App() {
  return <Home />;
}
>>>>>>> feature/Factura_Page
