import { authFetch } from '../../utils/auth';
import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import NuevoServicioModal from '../../components/NuevoServicioModal/NuevoServicioModal';
import ServicioProductoCard from '../../components/Serviciolistar/ServicioProductoCard';
import { useEmpresa } from '@context/EmpresaContext.tsx';
import { FaBoxOpen, FaPlus } from 'react-icons/fa6';
import './Servicios.css';

const API_BASE = 'http://localhost:8080/api/v1/facturacion/item';

type ServicioProducto = {
  id: string; // UUID from backend
  tipo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  iva: number;
  moneda?: string;
};

export default function Servicios() {
  const { empresas, selectedEmpresaId } = useEmpresa();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [servicios, setServicios] = useState<ServicioProducto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServicios = async () => {
    if (!selectedEmpresaId) {
      setServicios([]);
      return;
    }

    try {
      setLoading(true);
      const res = await authFetch(`${API_BASE}/empresa/${selectedEmpresaId}`);
      const json = await res.json();
      
      // Mapear los datos que vienen del backend
      const mapped = (json.data ?? []).map((item: any) => ({
        id: item.id,
        tipo: item.categoria || 'SERVICIO',
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio_sin_iva || 0,
        iva: item.iva ? (item.iva.porcentaje >= 1 ? item.iva.porcentaje : item.iva.porcentaje * 100) : 13,
        moneda: 'USD'
      }));
      setServicios(mapped);
    } catch (err) {
      console.error('Error al cargar servicios/items:', err);
      setServicios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, [selectedEmpresaId]);

  const hasItems = servicios.length > 0;

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
            disabled={!selectedEmpresaId}
            title={!selectedEmpresaId ? "Selecciona una empresa primero" : ""}
          >
            <FaPlus />
            <span>Nuevo Servicio/Producto</span>
          </button>
        </div>

        {!selectedEmpresaId ? (
          <div className="servicios__emptyPanel">
            <div className="servicios__emptyIconWrap">
              <FaBoxOpen className="servicios__emptyIcon" />
            </div>
            <h3 className="servicios__emptyTitle">Selecciona una empresa</h3>
            <p className="servicios__emptyText">
              Debes seleccionar o crear una empresa en la barra superior para ver sus servicios/productos.
            </p>
          </div>
        ) : loading ? (
          <div className="servicios__emptyPanel">
            <p className="servicios__emptyText">Cargando servicios y productos...</p>
          </div>
        ) : !hasItems ? (
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
          </div>
        ) : (
          <div className="servicios__grid">
            {(() => {
              const activeIndex = empresas.findIndex(emp => emp.id === selectedEmpresaId);
              const currentThemeIndex = activeIndex >= 0 ? activeIndex % 4 : 0;
              return servicios.map((item: ServicioProducto) => (
                <ServicioProductoCard
                  key={item.id}
                  tipo={item.tipo}
                  nombre={item.nombre}
                  precio={item.precio}
                  iva={item.iva}
                  themeIndex={currentThemeIndex}
                  {...(item.descripcion ? { descripcion: item.descripcion } : {})}
                  {...(item.moneda ? { moneda: item.moneda } : {})}
                />
              ));
            })()}
          </div>
        )}
      </section>

      <NuevoServicioModal 
        isOpen={isOpenModal} 
        setIsOpen={setIsOpenModal} 
        onCreated={fetchServicios}
      />
    </>
  );
}
