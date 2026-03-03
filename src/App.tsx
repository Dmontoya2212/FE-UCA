import { useState } from "react";
import Header from "./components/Header/Header";
import NavBar from "./components/NavBar/NavBar";

export default function App() {
    const [active, setActive] = useState<"dashboard" | "clientes" | "servicios" | "facturas">("dashboard");

    return (
        <>
            <Header
                title="Sistema de Facturación Electrónica"
                subtitle="Gestiona tus facturas de forma simple y profesional"
            />
            <div style={{ padding: "0 40px" }}>
                <NavBar active={active} onChange={setActive} />
            </div>
        </>
    );
}