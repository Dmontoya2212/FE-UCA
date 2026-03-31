import { useState } from "react";
import MostrarFacturas from "../../components/Factura/MostrarFacturas";
import NuevaFacturaModal from "../../components/NuevaFacturaModal/NuevaFacturaModal";
import { FaFileInvoice, FaPlus } from "react-icons/fa6";
import type { Factura } from "../../models/factura.model";
import type { Cliente } from "../../models/cliente.model";
import "./Facturas.css";

type NavKey = 'dashboard' | 'clientes' | 'servicios' | 'facturas';

const mockFacturas: Factura[] = [];
const mockClientes: Cliente[] = [];

export default function Facturas({ }) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const facturas = mockFacturas;
    const clientes = mockClientes;
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
        >
          <FaPlus />
          <span>Nueva Factura</span>
        </button>
      </div>

            {!hasFacturas ? (
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
                        onVer={(f: Factura) => console.log("ver", f)}
                        onDelete={(f: Factura) => console.log("eliminar", f)}
                    />
                </div>
            )}

            <NuevaFacturaModal
                isOpen={modalAbierto}
                setIsOpen={setModalAbierto}
                clientes={clientes}
                onGuardar={(cabecera, lineas) => console.log(cabecera, lineas)}
            />
        </section>
    );
}
