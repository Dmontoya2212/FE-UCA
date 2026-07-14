import { createContext } from 'react';

type UserRole = 'SUPERADMIN' | 'ADMINISTRADOR' | 'USUARIO';

type UserSession = {
  id: string;
  nombre: string;
  email: string;
  esAdmin: boolean;
  rol: UserRole;
  token: string;
  empresaId: string;
};

type AuthContextType = {
  user: UserSession | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  hasRole: (...roles: UserRole[]) => boolean;
  isSuperAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };
export type { AuthContextType, UserRole, UserSession };
