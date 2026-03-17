import { useState } from "react";
import MostrarFacturas from "../../components/Factura/MostrarFacturas";
import { FaFileInvoice, FaPlus } from "react-icons/fa6";
import type { Factura } from "../../models/factura.model";
import "./Facturas.css";

type Props = {
    active: "dashboard" | "clientes" | "servicios" | "facturas";
    onChange: (key: "dashboard" | "clientes" | "servicios" | "facturas") => void;
};

const mockFacturas: Factura[] = [];

export default function Facturas({ }: Props) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const facturas = mockFacturas;
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
                        onVer={(f) => console.log("ver", f)}
                        onDelete={(f) => console.log("eliminar", f)}
                    />
                </div>
            )}
        </section>
    );
}