import { useState } from 'react';
import { authFetch } from '../../utils/auth';
import type { EmpresaResponse } from '@models/Empresa';
import { FaTimes } from 'react-icons/fa';
import { apiUrl } from '@/config/api';
import './NuevoUsuarioModal.css';

const API_BASE = apiUrl('/api/v1/facturacion/usuario');

type ErrorResponse = {
  message?: string;
  data?: string;
};

interface NuevoUsuarioModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCreated: () => void;
  empresasDisponibles: EmpresaResponse[];
}

export default function NuevoUsuarioModal({ isOpen, setIsOpen, onCreated, empresasDisponibles }: NuevoUsuarioModalProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('USUARIO');
  const [empresaIds, setEmpresaIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEmpresaToggle = (id: string) => {
    setEmpresaIds(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (empresaIds.length === 0) {
      setError('Debes seleccionar al menos una empresa');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await authFetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol,
          empresaIds,
          esAdmin: rol === 'SUPERADMIN' || rol === 'ADMINISTRADOR'
        })
      });

      if (!res.ok) {
        const errJson = (await res.json()) as ErrorResponse;
        throw new Error(errJson.message || errJson.data || 'Error al crear usuario');
      }

      setIsOpen(false);
      onCreated();
      // Reset form
      setNombre('');
      setEmail('');
      setPassword('');
      setRol('USUARIO');
      setEmpresaIds([]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal__overlay" onClick={() => setIsOpen(false)}>
      <div className="modal__content" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={() => setIsOpen(false)}>
          <FaTimes />
        </button>
        <h2 className="modal__title">Nuevo Usuario</h2>
        
        {error && <div className="modal__error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="modal__form">
          <div className="form__group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              required 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              placeholder="Ej. Juan Pérez"
            />
          </div>
          
          <div className="form__group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Ej. juan@empresa.com"
            />
          </div>
          
          <div className="form__group">
            <label>Contraseña</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Mínimo 8 caracteres"
              minLength={8}
            />
          </div>

          <div className="form__group">
            <label>Rol</label>
            <select value={rol} onChange={e => setRol(e.target.value)}>
              <option value="USUARIO">Usuario (Limitado)</option>
              <option value="ADMINISTRADOR">Administrador (Empresa)</option>
              <option value="SUPERADMIN">Super Admin (Sistema)</option>
            </select>
          </div>

          <div className="form__group">
            <label>Empresas Asignadas</label>
            <div className="modal__empresasList">
              {empresasDisponibles.map(emp => (
                <label key={emp.id} className="modal__checkboxLabel">
                  <input 
                    type="checkbox" 
                    checked={empresaIds.includes(emp.id)}
                    onChange={() => handleEmpresaToggle(emp.id)}
                  />
                  {emp.nombreLegal}
                </label>
              ))}
            </div>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn-cancel" onClick={() => setIsOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
