import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type UserSession = {
  id: string;
  nombre: string;
  email: string;
  esAdmin: boolean;
  token: string;
  empresaId: string;
};

type AuthContextType = {
  user: UserSession | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
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

      const sessionData: UserSession = json.data;
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

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
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
