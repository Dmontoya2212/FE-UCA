import { useState, type ReactNode } from 'react';
import { apiUrl } from '@/config/api';
import { AuthContext, type UserRole, type UserSession } from './AuthContextValue';

type LoginResponseData = {
  id: string;
  nombre: string;
  email: string;
  esAdmin: boolean;
  rol?: UserRole;
  token: string;
  empresaId: string;
};

type ApiResponse<T> = {
  data?: T;
  message?: string;
};

const getSavedSession = (): UserSession | null => {
  const savedSession = localStorage.getItem('user_session');
  if (!savedSession) return null;

  try {
    return JSON.parse(savedSession) as UserSession;
  } catch {
    localStorage.removeItem('user_session');
    return null;
  }
};

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => getSavedSession());
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/v1/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const json = (await res.json()) as ApiResponse<LoginResponseData | string>;

      if (!res.ok) {
        throw new Error(
          typeof json.data === 'string'
            ? json.data
            : json.message || 'Credenciales incorrectas',
        );
      }

      const data = json.data;
      if (!data || typeof data === 'string') {
        throw new Error('Respuesta de inicio de sesion invalida');
      }

      const sessionData: UserSession = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        esAdmin: data.esAdmin,
        rol: data.rol || (data.esAdmin ? 'ADMINISTRADOR' : 'USUARIO'),
        token: data.token,
        empresaId: data.empresaId,
      };

      setUser(sessionData);
      localStorage.setItem('user_session', JSON.stringify(sessionData));
      localStorage.setItem('selectedEmpresaId', sessionData.empresaId);
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Error al iniciar sesion');
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('selectedEmpresaId');
  };

  const hasRole = (...roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  const isSuperAdmin = () => hasRole('SUPERADMIN');

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading: false, error, hasRole, isSuperAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export type { UserRole, UserSession };
