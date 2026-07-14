import { createContext } from 'react';
import type { EmpresaResponse } from '@models/Empresa.ts';

type EmpresaContextType = {
  empresas: EmpresaResponse[];
  selectedEmpresaId: string | null;
  setSelectedEmpresaId: (id: string | null) => void;
  refreshEmpresas: () => Promise<void>;
  loading: boolean;
};

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

export { EmpresaContext };
export type { EmpresaContextType };
