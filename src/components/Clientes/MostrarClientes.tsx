import './MostrarClientes.css';
import type { ClienteResponse } from '@models/Cliente.ts';
import { FaPenToSquare, FaTrashCan } from 'react-icons/fa6';

type Props = {
  clientes?: ClienteResponse[] | null;
  themeIndex?: number;
  onEdit?: (cliente: ClienteResponse) => void;
  onDelete?: (cliente: ClienteResponse) => void;
};

export default function MostrarClientes({ clientes, themeIndex = 0, onEdit, onDelete }: Props) {
  return (
    <section className="mc">
      <div className="mc__tableWrap">
        <table className="mc__table">
          <thead>
            <tr>
              <th>Nombre/Razón Social</th>
              <th>NIF/CIF</th>
              <th>Ciudad</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th className="mc__thActions">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {!clientes || clientes.length === 0 ? (
              <tr>
                <td className="mc__emptyCell" colSpan={6}>
                  No hay clientes para mostrar.
                </td>
              </tr>
            ) : (
              clientes.map((c) => {
                return (
                  <tr key={c.id} className={`mc__row mc__row--style-${themeIndex}`}>
                    <td className="mc__strong">{c.nombreRazonSocial || c.nombre_razon_social}</td>
                    <td className="mc__muted">{c.nifCif ?? c.nif_cif ?? '—'}</td>
                    <td className="mc__muted">{c.ciudad ?? '—'}</td>
                    <td className="mc__muted">{c.email ?? '—'}</td>
                    <td className="mc__muted">{c.telefono ?? '—'}</td>

                    <td className="mc__actions">
                      <button
                        type="button"
                        className="mc__iconBtn mc__iconBtn--edit"
                        onClick={() => onEdit?.(c)}
                        title="Editar"
                      >
                        <FaPenToSquare size={14} />
                      </button>

                      <button
                        type="button"
                        className="mc__iconBtn mc__iconBtn--danger"
                        onClick={() => onDelete?.(c)}
                        title="Eliminar"
                      >
                        <FaTrashCan size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
