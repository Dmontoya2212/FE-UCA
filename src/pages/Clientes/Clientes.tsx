import { authFetch } from '../../utils/auth';
import { useState, useEffect, useCallback } from 'react';
import MostrarClientes from '../../components/Clientes/MostrarClientes';
import NuevoClienteModal from '../../components/NuevoClienteModal/NuevoClienteModal';
import { FaUsers, FaPlus } from 'react-icons/fa6';
import type { ClienteResponse } from '@models/Cliente.ts';
import { useEmpresa } from '@context/useEmpresa.ts';
import { apiUrl } from '@/config/api';
import './Clientes.css';

const API_BASE = apiUrl('/api/v1/empresas');

type ApiResponse<T> = {
  data?: T;
};

type ClienteApiResponse = {
  id: string;
  empresa_id?: string;
  nombre_razon_social?: string;
  nif_cif?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  telefono?: string;
  activo?: boolean;
};

const mapCliente = (c: ClienteApiResponse): ClienteResponse => ({
  id: c.id,
  ...(c.empresa_id !== undefined ? { empresaId: c.empresa_id } : {}),
  ...(c.nombre_razon_social !== undefined ? { nombreRazonSocial: c.nombre_razon_social } : {}),
  ...(c.nif_cif !== undefined ? { nifCif: c.nif_cif } : {}),
  ...(c.email !== undefined ? { email: c.email } : {}),
  ...(c.direccion !== undefined ? { direccion: c.direccion } : {}),
  ...(c.ciudad !== undefined ? { ciudad: c.ciudad } : {}),
  ...(c.codigo_postal !== undefined ? { codigoPostal: c.codigo_postal } : {}),
  ...(c.telefono !== undefined ? { telefono: c.telefono } : {}),
  ...(c.activo !== undefined ? { activo: c.activo } : {}),
});

export default function Clientes() {
  const { empresas, selectedEmpresaId } = useEmpresa();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClientes = useCallback(async () => {
    if (!selectedEmpresaId) {
      setClientes([]);
      return;
    }
    
    try {
      setLoading(true);
      const res = await authFetch(`${API_BASE}/${selectedEmpresaId}/clientes`);
      const json = (await res.json()) as ApiResponse<ClienteApiResponse[]>;
      const mapped = (json.data ?? []).map(mapCliente);
      setClientes(mapped);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, [selectedEmpresaId]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchClientes();
    });
  }, [fetchClientes]);

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
          disabled={!selectedEmpresaId}
          title={!selectedEmpresaId ? "Selecciona una empresa primero" : ""}
        >
          <FaPlus />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {!selectedEmpresaId ? (
        <div className="clientes__emptyPanel">
          <div className="clientes__emptyIconWrap">
            <FaUsers className="clientes__emptyIcon" />
          </div>
          <h3 className="clientes__emptyTitle">Selecciona una empresa</h3>
          <p className="clientes__emptyText">
            Debes seleccionar o crear una empresa en la barra superior para ver sus clientes.
          </p>
        </div>
      ) : loading ? (
        <div className="clientes__emptyPanel">
          <p className="clientes__emptyText">Cargando clientes...</p>
        </div>
      ) : !hasClientes ? (
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
            themeIndex={(() => {
              const activeIndex = empresas.findIndex(emp => emp.id === selectedEmpresaId);
              return activeIndex >= 0 ? activeIndex % 4 : 0;
            })()}
            onDelete={(c) => console.log('eliminar', c)}
            onEdit={(c) => console.log('editar', c)}
          />
        </div>
      )}

      <NuevoClienteModal 
        isOpen={modalAbierto} 
        setIsOpen={setModalAbierto} 
        onCreated={fetchClientes}
      />
    </section>
  );
}
