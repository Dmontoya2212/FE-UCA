import { authFetch } from '../utils/auth';
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { EmpresaResponse } from '@models/Empresa.ts';
import { apiUrl } from '@/config/api';
import { useAuth } from './useAuth';
import { EmpresaContext } from './EmpresaContextValue';

const EMPRESA_API = apiUrl('/api/v1/facturacion/empresa');

type ApiResponse<T> = {
  data?: T;
};

export function EmpresaProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
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

  const refreshEmpresas = useCallback(async () => {
    if (!user) {
      setEmpresas([]);
      setSelectedEmpresaId(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await authFetch(EMPRESA_API);
      const json = (await res.json()) as ApiResponse<EmpresaResponse[]>;
      const list = json.data ?? [];
      setEmpresas(list);

      const savedId = localStorage.getItem('selectedEmpresaId');
      const exists = list.some((emp: EmpresaResponse) => emp.id === savedId);
      const firstEmpresaId = list[0]?.id;
      if (firstEmpresaId && (!savedId || !exists)) {
        setSelectedEmpresaId(firstEmpresaId);
      } else if (list.length === 0) {
        setSelectedEmpresaId(null);
      }
    } catch (err) {
      console.error('Error al cargar empresas:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    queueMicrotask(() => {
      void refreshEmpresas();
    });
  }, [authLoading, refreshEmpresas]);

  return (
    <EmpresaContext.Provider
      value={{ empresas, selectedEmpresaId, setSelectedEmpresaId, refreshEmpresas, loading }}
    >
      {children}
    </EmpresaContext.Provider>
  );
}
