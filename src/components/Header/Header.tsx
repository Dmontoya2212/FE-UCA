// src/components/Header/Header.tsx
import { useEmpresa } from '@context/useEmpresa.ts';
import { useAuth } from '../../contexts/useAuth.ts';
import { FaRightFromBracket } from 'react-icons/fa6';
import "./Header.css";

type HeaderProps = {
    title: string;
    subtitle: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
    const { empresas, selectedEmpresaId, setSelectedEmpresaId } = useEmpresa();
    const { user, logout } = useAuth();

    return (
        <header className="app-header">
            <div className="app-header__content">
                <div className="app-header__text">
                    <h1 className="app-header__title">{title}</h1>
                    <p className="app-header__subtitle">{subtitle}</p>
                </div>
                
                <div className="app-header__right">
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

                    {user && (
                        <div className="app-header__user-info">
                            <span className="app-header__username" title={user.email}>
                                {user.nombre}
                            </span>
                            <button onClick={logout} className="app-header__logout-btn" title="Cerrar Sesión">
                                <FaRightFromBracket />
                                <span>Salir</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
