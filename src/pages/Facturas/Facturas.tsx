import { useState, useEffect } from 'react';
import MostrarFacturas from '../../components/Factura/MostrarFacturas';
import NuevaFacturaModal from '../../components/NuevaFacturaModal/NuevaFacturaModal';
import { FaFileInvoice, FaPlus } from 'react-icons/fa6';
import type { FacturaResponse } from '@models/Factura.ts';
import type { ClienteResponse } from '@models/Cliente.ts';
import { useEmpresa } from '@context/EmpresaContext.tsx';
import './Facturas.css';

const FACTURA_API = 'http://localhost:8080/api/v1/facturacion/factura';
const CLIENTE_API = 'http://localhost:8080/api/v1/facturacion/cliente';
const ITEM_API = 'http://localhost:8080/api/v1/facturacion/item';

export default function Facturas() {
  const { selectedEmpresaId } = useEmpresa();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [facturas, setFacturas] = useState<FacturaResponse[]>([]);
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!selectedEmpresaId) {
      setFacturas([]);
      setClientes([]);
      setServicios([]);
      return;
    }

    try {
      setLoading(true);
      // Cargar facturas
      const facturasRes = await fetch(`${FACTURA_API}?empresaId=${selectedEmpresaId}`);
      const facturasJson = await facturasRes.json();
      setFacturas(facturasJson.data ?? []);

      // Cargar clientes para el modal
      const clientesRes = await fetch(`${CLIENTE_API}/empresa/${selectedEmpresaId}`);
      const clientesJson = await clientesRes.json();
      // Mapear snake_case a camelCase como en Clientes.tsx
      const mappedClientes = (clientesJson.data ?? []).map((c: any) => ({
        id: c.id,
        empresaId: c.empresa_id,
        nombreRazonSocial: c.nombre_razon_social,
        nifCif: c.nif_cif,
        email: c.email,
        direccion: c.direccion,
        ciudad: c.ciudad,
        codigoPostal: c.codigo_postal,
        telefono: c.telefono,
        activo: c.activo
      }));
      setClientes(mappedClientes);

      // Cargar items (servicios/productos)
      const itemsRes = await fetch(`${ITEM_API}/empresa/${selectedEmpresaId}`);
      const itemsJson = await itemsRes.json();
      setServicios(itemsJson.data ?? []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setFacturas([]);
      setClientes([]);
      setServicios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedEmpresaId]);

  const hasFacturas = facturas.length > 0;

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
          onClick={() => setModalAbierto(true)}
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
            onVer={(f: FacturaResponse) => console.log('ver', f)}
            onDelete={(f: FacturaResponse) => console.log('eliminar', f)}
          />
        </div>
      )}

      <NuevaFacturaModal
        isOpen={modalAbierto}
        setIsOpen={setModalAbierto}
        clientes={clientes}
        servicios={servicios}
        onCreated={fetchData}
      />
    </section>
  );
}
