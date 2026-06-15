import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { EmpresaResponse } from '@models/Empresa.ts';

const EMPRESA_API = 'http://localhost:8080/api/v1/facturacion/empresa';

type EmpresaContextType = {
  empresas: EmpresaResponse[];
  selectedEmpresaId: string | null;
  setSelectedEmpresaId: (id: string | null) => void;
  refreshEmpresas: () => Promise<void>;
  loading: boolean;
};

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

export function EmpresaProvider({ children }: { children: ReactNode }) {
  const [empresas, setEmpresas] = useState<EmpresaResponse[]>([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshEmpresas = async () => {
    try {
      setLoading(true);
      const res = await fetch(EMPRESA_API);
      const json = await res.json();
      const list = json.data ?? [];
      setEmpresas(list);

      // Select the first company by default if none is selected
      if (list.length > 0 && !selectedEmpresaId) {
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
    refreshEmpresas();
  }, []);

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
