import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { FaEnvelope, FaLock, FaRightToBracket, FaEye, FaEyeSlash } from 'react-icons/fa6';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      // Al iniciar sesión exitosamente, redirigir al Home
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Credenciales incorrectas. Intenta de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-backdrop-glow"></div>
      <div className="login-backdrop-glow-secondary"></div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-box">
            <span className="login-logo-text">FE-UCA</span>
          </div>
          <h1 className="login-title">Facturación Electrónica</h1>
          <p className="login-subtitle">Ingresa tus credenciales para acceder al sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && (
            <div className="login-error-alert animate-fade-in">
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="login-input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="login-input-wrapper">
              <FaEnvelope className="login-input-icon" />
              <input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="login-input-wrapper">
              <FaLock className="login-input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="login-password-input"
              />
              <button
                type="button"
                className="login-password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex={-1}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <span className="login-spinner"></span>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <FaRightToBracket />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>© {new Date().getFullYear()} Sistema de Facturación Electrónica. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
