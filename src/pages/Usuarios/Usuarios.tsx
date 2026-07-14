import { authFetch } from '../../utils/auth';
import { useState, useEffect } from 'react';
import NuevoUsuarioModal from '../../components/NuevoUsuarioModal/NuevoUsuarioModal';
import { FaUserShield, FaPlus, FaTrash, FaPen } from 'react-icons/fa6';
import type { UsuarioResponse } from '@models/Usuario.ts';
import { useEmpresa } from '@context/EmpresaContext.tsx';
import './Usuarios.css';

const API_BASE = 'http://localhost:8080/api/v1/facturacion/usuario';

export default function Usuarios() {
  const { selectedEmpresaId, empresas } = useEmpresa();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = async () => {
    if (!selectedEmpresaId) {
      setUsuarios([]);
      return;
    }
    
    try {
      setLoading(true);
      const res = await authFetch(`http://localhost:8080/api/v1/empresas/${selectedEmpresaId}/usuarios`);
      const json = await res.json();
      setUsuarios(json.data ?? []);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [selectedEmpresaId]);

  const handleDelete = async (id: string) => {
    if (!selectedEmpresaId) return;
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        await authFetch(`http://localhost:8080/api/v1/empresas/${selectedEmpresaId}/usuarios/${id}`, { method: 'DELETE' });
        fetchUsuarios();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const hasUsuarios = usuarios.length > 0;

  return (
    <section className="usuarios__section">
      <div className="usuarios__top">
        <div className="usuarios__titleWrap">
          <div className="usuarios__iconBox">
            <FaUserShield className="usuarios__titleIcon" />
          </div>
          <div>
            <h2 className="usuarios__title">Gestión de Usuarios</h2>
            <p className="usuarios__subtitle">
              Administra los accesos al sistema
            </p>
          </div>
        </div>

        <button
          type="button"
          className="usuarios__newButton"
          onClick={() => setModalAbierto(true)}
        >
          <FaPlus />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {!selectedEmpresaId ? (
        <div className="usuarios__emptyPanel">
          <h3 className="usuarios__emptyTitle">Selecciona una empresa</h3>
          <p className="usuarios__emptyText">
            Debes seleccionar una empresa en la barra superior para ver sus usuarios asociados.
          </p>
        </div>
      ) : loading ? (
        <div className="usuarios__emptyPanel">
          <p className="usuarios__emptyText">Cargando usuarios...</p>
        </div>
      ) : !hasUsuarios ? (
        <div className="usuarios__emptyPanel">
          <h3 className="usuarios__emptyTitle">No hay usuarios</h3>
          <p className="usuarios__emptyText">
            Comienza agregando tu primer usuario.
          </p>
        </div>
      ) : (
        <div className="usuarios__panel">
          <table className="usuarios__table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.rol}</td>
                  <td>
                    <span className={`usuarios__badge ${u.activo ? 'activo' : 'inactivo'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button className="usuarios__actionBtn edit" onClick={() => {}}>
                      <FaPen />
                    </button>
                    <button className="usuarios__actionBtn delete" onClick={() => handleDelete(u.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NuevoUsuarioModal 
        isOpen={modalAbierto} 
        setIsOpen={setModalAbierto} 
        onCreated={fetchUsuarios}
        empresasDisponibles={empresas}
      />
    </section>
  );
}
