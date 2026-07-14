import { authFetch } from '../utils/auth';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { EmpresaResponse } from '@models/Empresa.ts';
import { useAuth } from './AuthContext';
import { apiUrl } from '@/config/api';

const EMPRESA_API = apiUrl('/api/v1/facturacion/empresa');

type EmpresaContextType = {
  empresas: EmpresaResponse[];
  selectedEmpresaId: string | null;
  setSelectedEmpresaId: (id: string | null) => void;
  refreshEmpresas: () => Promise<void>;
  loading: boolean;
};

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

export function EmpresaProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState<EmpresaResponse[]>([]);
  const [selectedEmpresaId, setSelectedEmpresaIdState] = useState<string | null>(() => {
    return localStorage.getItem('selectedEmpresaId');
  });
  const [loading, setLoading] = useState(true);

  const setSelectedEmpresaId = (id: string | null) => {
    setSelectedEmpresaIdState(id);
    if (id) {
      localStorage.setItem('selectedEmpresaId', id);
    } else {
      localStorage.removeItem('selectedEmpresaId');
    }
  };

  const refreshEmpresas = async () => {
    try {
      setLoading(true);
      const res = await authFetch(EMPRESA_API);
      
      const json = await res.json();
      const list = json.data ?? [];
      setEmpresas(list);

      // Select default if saved one is invalid or none selected
      const savedId = localStorage.getItem('selectedEmpresaId');
      const exists = list.some((emp: EmpresaResponse) => emp.id === savedId);
      if (list.length > 0 && (!savedId || !exists)) {
        setSelectedEmpresaId(list[0].id);
      } else if (list.length === 0) {
        setSelectedEmpresaId(null);
      }
    } catch (err) {
      console.error('Error al cargar empresas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      refreshEmpresas();
    } else {
      setEmpresas([]);
      setSelectedEmpresaId(null);
      setLoading(false);
    }
  }, [user]);

  return (
    <EmpresaContext.Provider
      value={{ empresas, selectedEmpresaId, setSelectedEmpresaId, refreshEmpresas, loading }}
    >
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  const context = useContext(EmpresaContext);
  if (context === undefined) {
    throw new Error('useEmpresa must be used within an EmpresaProvider');
  }
  return context;
}
