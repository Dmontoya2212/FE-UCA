import { authFetch } from '../../utils/auth';
import { useState, useEffect, useCallback } from 'react';
import MostrarFacturas from '../../components/Factura/MostrarFacturas';
import NuevaFacturaModal from '../../components/NuevaFacturaModal/NuevaFacturaModal';
import { FaFileInvoice, FaPlus } from 'react-icons/fa6';
import type { FacturaResponse } from '@models/Factura.ts';
import type { ClienteResponse } from '@models/Cliente.ts';
import { useEmpresa } from '@context/useEmpresa.ts';
import { apiUrl } from '@/config/api';
import './Facturas.css';

const FACTURA_API = apiUrl('/api/v1/empresas');
const CLIENTE_API = apiUrl('/api/v1/empresas');
const ITEM_API = apiUrl('/api/v1/empresas');

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

type ServicioFactura = {
  id: string;
  nombre: string;
  descripcion?: string;
  precio_sin_iva: number;
  iva: {
    porcentaje: number;
  };
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

export default function Facturas() {
  const { empresas, selectedEmpresaId } = useEmpresa();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [facturas, setFacturas] = useState<FacturaResponse[]>([]);
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [servicios, setServicios] = useState<ServicioFactura[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!selectedEmpresaId) {
      setFacturas([]);
      setClientes([]);
      setServicios([]);
      return;
    }

    try {
      setLoading(true);
      // Cargar facturas
      const facturasRes = await authFetch(`${FACTURA_API}/${selectedEmpresaId}/facturas`);
      const facturasJson = (await facturasRes.json()) as ApiResponse<FacturaResponse[]>;
      setFacturas(facturasJson.data ?? []);

      // Cargar clientes para el modal
      const clientesRes = await authFetch(`${CLIENTE_API}/${selectedEmpresaId}/clientes`);
      const clientesJson = (await clientesRes.json()) as ApiResponse<ClienteApiResponse[]>;
      // Mapear snake_case a camelCase como en Clientes.tsx
      const mappedClientes = (clientesJson.data ?? []).map(mapCliente);
      setClientes(mappedClientes);

      // Cargar items (servicios/productos)
      const itemsRes = await authFetch(`${ITEM_API}/${selectedEmpresaId}/items`);
      const itemsJson = (await itemsRes.json()) as ApiResponse<ServicioFactura[]>;
      setServicios(itemsJson.data ?? []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setFacturas([]);
      setClientes([]);
      setServicios([]);
    } finally {
      setLoading(false);
    }
  }, [selectedEmpresaId]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
  }, [fetchData]);

  const hasFacturas = facturas.length > 0;

  const [facturaToEdit, setFacturaToEdit] = useState<FacturaResponse | undefined>();

  const handleDelete = async (f: FacturaResponse) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la factura ${f.numero}?`)) return;
    try {
      const res = await authFetch(`${FACTURA_API}/${selectedEmpresaId}/facturas/${f.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      void fetchData();
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la factura');
    }
  };

  const handleEdit = (f: FacturaResponse) => {
    setFacturaToEdit(f);
    setModalAbierto(true);
  };

  const handleOpenModalNew = () => {
    setFacturaToEdit(undefined);
    setModalAbierto(true);
  };

  return (
    <section className="facturas__section">
      <div className="facturas__top">
        <div className="facturas__titleWrap">
          <div className="facturas__iconBox">
            <FaFileInvoice className="facturas__titleIcon" />
          </div>
          <div>
            <h2 className="facturas__title">Facturas</h2>
          </div>
        </div>

        <button
          type="button"
          className="facturas__newButton"
          onClick={handleOpenModalNew}
          disabled={!selectedEmpresaId}
          title={!selectedEmpresaId ? "Selecciona una empresa primero" : ""}
        >
          <FaPlus />
          <span>Nueva Factura</span>
        </button>
      </div>

      {!selectedEmpresaId ? (
        <div className="facturas__emptyPanel">
          <div className="facturas__emptyIconWrap">
            <FaFileInvoice className="facturas__emptyIcon" />
          </div>
          <h3 className="facturas__emptyTitle">Selecciona una empresa</h3>
          <p className="facturas__emptyText">
            Debes seleccionar o crear una empresa en la barra superior para ver sus facturas.
          </p>
        </div>
      ) : loading ? (
        <div className="facturas__emptyPanel">
          <p className="facturas__emptyText">Cargando facturas...</p>
        </div>
      ) : !hasFacturas ? (
        <div className="facturas__emptyPanel">
          <div className="facturas__emptyIconWrap">
            <FaFileInvoice className="facturas__emptyIcon" />
          </div>
          <h3 className="facturas__emptyTitle">No hay facturas</h3>
          <p className="facturas__emptyText">
            Comienza creando tu primera factura electrónica
          </p>
        </div>
      ) : (
        <div className="facturas__panel">
          <MostrarFacturas
            facturas={facturas}
            themeIndex={(() => {
              const activeIndex = empresas.findIndex(emp => emp.id === selectedEmpresaId);
              return activeIndex >= 0 ? activeIndex % 4 : 0;
            })()}
            onVer={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      <NuevaFacturaModal
        isOpen={modalAbierto}
        setIsOpen={setModalAbierto}
        clientes={clientes}
        servicios={servicios}
        onCreated={fetchData}
        initialData={facturaToEdit}
      />
    </section>
  );
}
