import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem('user_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.data || 'Credenciales incorrectas');
      }

      const data = json.data;
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
      // Sincronizar selectedEmpresaId con el localStorage para que EmpresaContext lo use
      localStorage.setItem('selectedEmpresaId', sessionData.empresaId);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
    <AuthContext.Provider value={{ user, login, logout, loading, error, hasRole, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { UserRole, UserSession };
