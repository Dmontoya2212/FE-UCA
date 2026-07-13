import './MostrarFacturas.css';
import { FaEye, FaTrashCan } from 'react-icons/fa6';
import type { Factura } from '@models/Factura.ts';

type Props = {
  facturas: Factura[];
  themeIndex?: number;
  onVer?: (factura: Factura) => void;
  onDelete?: (factura: Factura) => void;
};

import { useAuth } from '../../contexts/AuthContext';

export default function MostrarFacturas({ facturas, themeIndex = 0, onVer, onDelete }: Props) {
  const { user } = useAuth();
  const esBasico = user?.rol === 'USUARIO';

  return (
    <section className="mf">
      <div className="mf__tableWrap">
        <table className="mf__table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Cód. Gen.</th>
              <th>Total</th>
              <th>Estado</th>
              <th className="mf__thActions">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {!facturas || facturas.length === 0 ? (
              <tr>
                <td className="mf__emptyCell" colSpan={7}>
                  No hay facturas registradas.
                </td>
              </tr>
            ) : (
              facturas.map((f) => {
                const cod = f.codigoGeneracion ? f.codigoGeneracion.substring(0, 8) + '...' : '—';
                return (
                  <tr key={f.id} className={`mf__row mf__row--style-${themeIndex}`}>
                    <td className="mf__numero mf__strong">{f.numero}</td>
                    <td className="mf__muted">{f.clienteNombre ?? '—'}</td>
                    <td className="mf__muted">{f.fechaEmision}</td>
                    <td className="mf__muted" title={f.codigoGeneracion}>{cod}</td>
                    <td className="mf__total">
                      ${f.totalConIva?.toFixed(2) ?? '0.00'}
                    </td>
                    <td>
                      <span
                        className={`mf__badge mf__badge--${f.estado.toLowerCase()}`}
                      >
                        {f.estado}
                      </span>
                    </td>
                    <td className="mf__actions">
                      <button
                        type="button"
                        className="mf__iconBtn mf__iconBtn--view"
                        onClick={() => onVer?.(f)}
                        title="Ver detalle"
                      >
                        <FaEye size={14} />
                      </button>
                      
                      {!esBasico && (
                        <button
                          type="button"
                          className="mf__iconBtn mf__iconBtn--danger"
                          onClick={() => onDelete?.(f)}
                          title="Eliminar"
                        >
                          <FaTrashCan size={14} />
                        </button>
                      )}
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
