// src/components/Header/Header.tsx
import { useEmpresa } from '@context/EmpresaContext.tsx';
import "./Header.css";

type HeaderProps = {
    title: string;
    subtitle: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
    const { empresas, selectedEmpresaId, setSelectedEmpresaId } = useEmpresa();

    return (
        <header className="app-header">
            <div className="app-header__content">
                <div className="app-header__text">
                    <h1 className="app-header__title">{title}</h1>
                    <p className="app-header__subtitle">{subtitle}</p>
                </div>
                {empresas.length > 0 && (
                    <div className="app-header__selector">
                        <label htmlFor="empresa-select" className="app-header__label">Empresa Activa:</label>
                        <select 
                            id="empresa-select"
                            className="app-header__select" 
                            value={selectedEmpresaId || ''} 
                            onChange={(e) => setSelectedEmpresaId(e.target.value)}
                        >
                            {empresas.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.razon_social || emp.razonSocial || emp.nombre_legal || emp.nombreLegal || emp.nombre_comercial || emp.nombreComercial || 'Empresa Registrada'}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </header>
    );
}