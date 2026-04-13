import './MostrarFacturas.css';
import { FaEye, FaTrash } from 'react-icons/fa';
import type { Factura } from '@models/Factura.ts';

type Props = {
  facturas: Factura[];
  onVer?: (factura: Factura) => void;
  onDelete?: (factura: Factura) => void;
};

export default function MostrarFacturas({ facturas, onVer, onDelete }: Props) {
  return (
    <section className="mf">
      <div className="mf__tableWrap">
        <table className="mf__table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Vencimiento</th>
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
              facturas.map((f) => (
                <tr key={f.id}>
                  <td className="mf__numero">{f.numero}</td>
                  <td className="mf__muted">{f.clienteNombre ?? '—'}</td>
                  <td className="mf__muted">{f.fechaEmision}</td>
                  <td className="mf__muted">{f.fechaVencimiento ?? '—'}</td>
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
                      className="mf__iconBtn"
                      onClick={() => onVer?.(f)}
                      title="Ver detalle"
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      type="button"
                      className="mf__iconBtn mf__iconBtn--danger"
                      onClick={() => onDelete?.(f)}
                      title="Eliminar"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
