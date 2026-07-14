import { useContext } from 'react';
import { EmpresaContext } from './EmpresaContextValue';

export function useEmpresa() {
  const context = useContext(EmpresaContext);
  if (context === undefined) {
    throw new Error('useEmpresa must be used within an EmpresaProvider');
  }
  return context;
}
