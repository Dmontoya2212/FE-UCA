import DashboardIndicator from '../../components/DashboardIndicator/DashboardIndicator';
import EstadoFactura from '../../components/EstadoFactura/EstadoFactura';
import MostrarClientes from '../../components/Clientes/MostrarClientes';
import ServicioProductoCard from '../../components/Serviciolistar/ServicioProductoCard';
import {
  FaArrowTrendUp,
  FaCircleCheck,
  FaClock,
  FaUsers,
} from 'react-icons/fa6';
import type { Cliente } from '@models/cliente.model';
import './Home.css';

export default function Home() {
  // Mock temporal mientras se conecta la API
  const clientesMock: Cliente[] = [];

  return (
    <section className="home__section">
      <div className="home__sectionHeader">
        <h2 className="home__title">Panel de Control</h2>
        <p className="home__subtitle">
          Resumen general de tu sistema de facturación
        </p>
      </div>

      <div className="home__indicators">
        <DashboardIndicator
          title="Total Facturado"
          value="$0.00"
          subtitle="0 facturas totales"
          icon={<FaArrowTrendUp />}
          mode="info"
        />

        <DashboardIndicator
          title="Facturas Pagadas"
          value="$0.00"
          subtitle="0 facturas"
          icon={<FaCircleCheck />}
          mode="success"
        />

        <DashboardIndicator
          title="Pendiente de Cobro"
          value="$0.00"
          subtitle="0 facturas"
          icon={<FaClock />}
          mode="warning"
        />

        <DashboardIndicator
          title="Clientes Activos"
          value="0"
          subtitle="Clientes registrados"
          icon={<FaUsers />}
          mode="danger"
        />
      </div>

      <div className="home__middleGrid">
        <div className="home__panel">
          <div className="home__panelHeader">
            <h3 className="home__panelTitle">Últimas Facturas</h3>
          </div>

          <div className="home__emptyBox">
            <p className="home__emptyText">No hay facturas registradas</p>
          </div>
        </div>

        <div className="home__panel">
          <div className="home__panelHeader">
            <h3 className="home__panelTitle">Estado de Facturas</h3>
          </div>

          <div className="home__estadoList">
            <EstadoFactura variant="pagadas" />
            <EstadoFactura variant="enviadas" />
            <EstadoFactura variant="borradores" />
          </div>
        </div>
      </div>

      <div className="home__bottomGrid">
        <div className="home__panel">
          <div className="home__panelHeader">
            <h3 className="home__panelTitle">Clientes Registrados</h3>
          </div>

          <MostrarClientes clientes={clientesMock} />
        </div>

        <div className="home__panel">
          <div className="home__panelHeader">
            <h3 className="home__panelTitle">Servicios y Productos</h3>
          </div>

          <ServicioProductoCard
            tipo="Servicio"
            nombre="Consultoría IT"
            descripcion="Servicio de consultoría para infraestructura y desarrollo."
            precio={0}
            iva={21}
            moneda="$"
          />
        </div>
      </div>
    </section>
  );
}
