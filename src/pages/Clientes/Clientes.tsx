import { useState } from 'react';
import MostrarClientes from '../../components/Clientes/MostrarClientes';
import NuevoClienteModal from '../../components/NuevoClienteModal/NuevoClienteModal';
import { FaUsers, FaPlus } from 'react-icons/fa6';
import type { Cliente } from '../../models/cliente.model';
import './Clientes.css';

// type Props = {
//   active: 'dashboard' | 'clientes' | 'servicios' | 'facturas';
//   onChange: (key: 'dashboard' | 'clientes' | 'servicios' | 'facturas') => void;
// };

const mockClientes: Cliente[] = [];

export default function Clientes() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const clientes = mockClientes;
  const hasClientes = clientes.length > 0;

  return (
    <section className="clientes__section">
      <div className="clientes__top">
        <div className="clientes__titleWrap">
          <div className="clientes__iconBox">
            <FaUsers className="clientes__titleIcon" />
          </div>
          <div>
            <h2 className="clientes__title">Gestión de Clientes</h2>
            <p className="clientes__subtitle">
              Administra tu cartera de clientes
            </p>
          </div>
        </div>

        <button
          type="button"
          className="clientes__newButton"
          onClick={() => setModalAbierto(true)}
        >
          <FaPlus />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {!hasClientes ? (
        <div className="clientes__emptyPanel">
          <div className="clientes__emptyIconWrap">
            <FaUsers className="clientes__emptyIcon" />
          </div>
          <h3 className="clientes__emptyTitle">No hay clientes registrados</h3>
          <p className="clientes__emptyText">
            Comienza agregando tu primer cliente para poder crear facturas
          </p>
        </div>
      ) : (
        <div className="clientes__panel">
          <MostrarClientes
            clientes={clientes}
            onDelete={(c) => console.log('eliminar', c)}
            onEdit={(c) => console.log('editar', c)}
          />
        </div>
      )}

      <NuevoClienteModal isOpen={modalAbierto} setIsOpen={setModalAbierto} />
    </section>
  );
}
