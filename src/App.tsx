import { useState } from "react";
import Header from "./components/Header/Header";
import NavBar from "./components/NavBar/NavBar";
import DashboardIndicator from "./components/DashboardIndicator/DashboardIndicator";

function TrendIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 16l6-6 4 4 6-8" stroke="currentColor" strokeWidth="2" />
            <path d="M14 6h6v6" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

type NavKey = "dashboard" | "clientes" | "servicios" | "facturas";

export default function App() {
    const [active, setActive] = useState<NavKey>("dashboard");

    return (
        <>
            <Header
                title="Sistema de Facturación Electrónica"
                subtitle="Gestiona tus facturas de forma simple y profesional"
            />

            <div style={{ padding: "0 40px" }}>
                <NavBar active={active} onChange={setActive} />
            </div>

            {active === "dashboard" && (
                <div style={{ padding: "24px 40px", display: "flex", gap: 20 }}>
                    <DashboardIndicator
                        title="Total Facturado"
                        value="€0.00"
                        subtitle="0 facturas totales"
                        icon={<TrendIcon />}
                        mode="info"
                    />

                    <DashboardIndicator
                        title="Facturas Pagadas"
                        value="€0.00"
                        subtitle="0 facturas"
                        icon={<TrendIcon />}
                        mode="success"
                    />

                    <DashboardIndicator
                        title="Pendiente de Cobro"
                        value="€0.00"
                        subtitle="0 facturas"
                        icon={<TrendIcon />}
                        mode="warning"
                    />
                </div>
            )}
        </>
    );
}