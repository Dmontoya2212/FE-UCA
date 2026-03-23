import { useState } from 'react';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import NuevoServicioModal from '../../components/NuevoServicioModal/NuevoServicioModal';
import ServicioProductoCard from '../../components/Serviciolistar/ServicioProductoCard';

import { FaBoxOpen, FaPlus } from 'react-icons/fa6';
import './Servicios.css';

type NavKey = 'dashboard' | 'clientes' | 'servicios' | 'facturas';

type ServicioProducto = {
  id: number;
  tipo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  iva: number;
  moneda?: string;
};

export default function Servicios() {
  const [active, setActive] = useState<NavKey>('servicios');
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Mock temporal mientras se conecta la API
  const serviciosMock: ServicioProducto[] = [];

  const hasItems = serviciosMock.length > 0;

  return (
    <>
      <section className="servicios__section">
        <div className="servicios__top">
          <div className="servicios__titleWrap">
            <div className="servicios__iconBox">
              <FaBoxOpen className="servicios__titleIcon" />
            </div>

            <div>
              <h2 className="servicios__title">Servicios y Productos</h2>
              <p className="servicios__subtitle">
                Catálogo de servicios y productos para facturar
              </p>
            </div>
          </div>

          <button
            type="button"
            className="servicios__newButton"
            onClick={() => setIsOpenModal(true)}
          >
            <FaPlus />
            <span>Nuevo Servicio/Producto</span>
          </button>
        </div>

        {!hasItems ? (
          <div className="servicios__emptyPanel">
            <div className="servicios__emptyIconWrap">
              <FaBoxOpen className="servicios__emptyIcon" />
            </div>

            <h3 className="servicios__emptyTitle">
              No hay servicios o productos registrados
            </h3>

            <p className="servicios__emptyText">
              Agrega los servicios o productos que ofreces para facilitar la
              creación de facturas
            </p>

            <button
              type="button"
              className="servicios__emptyButton"
              onClick={() => setIsOpenModal(true)}
            >
              <FaPlus />
              <span>Agregar Primer Servicio/Producto</span>
            </button>
          </div>
        ) : (
          <div className="servicios__grid">
            {serviciosMock.map((item: ServicioProducto) => (
              <ServicioProductoCard
                key={item.id}
                tipo={item.tipo}
                nombre={item.nombre}
                precio={item.precio}
                iva={item.iva}
                {...(item.descripcion ? { descripcion: item.descripcion } : {})}
                {...(item.moneda ? { moneda: item.moneda } : {})}
              />
            ))}
          </div>
        )}
      </section>

      <NuevoServicioModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />
    </>
  );
}
