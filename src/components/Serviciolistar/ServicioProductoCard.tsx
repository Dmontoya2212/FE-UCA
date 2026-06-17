import './ServicioProductoCard.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

type Props = {
  tipo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  iva: number;
  moneda?: string;
  themeIndex?: number;

  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ServicioProductoCard({
  tipo,
  nombre,
  descripcion,
  precio,
  iva,
  moneda = '$',
  themeIndex = 0,
  onEdit,
  onDelete,
}: Props) {
  const total = precio * (1 + iva / 100);

  return (
    <div className={`spCard spCard--style-${themeIndex}`}>
      <div className="spCard__header">
        <span className="spCard__badge">{tipo}</span>

        <div className="spCard__actions">
          <button onClick={onEdit} className="spCard__icon spCard__icon--edit">
            <FaEdit className={'icon_edit'} />
          </button>

          <button
            onClick={onDelete}
            className="spCard__icon spCard__icon--delete"
          >
            <FaTrash className={'icon_delete'} />
          </button>
        </div>
      </div>

      <div className="spCard__body">
        <h3 className="spCard__title">{nombre}</h3>

        {descripcion && <p className="spCard__description">{descripcion}</p>}
      </div>

      <div className="spCard__divider" />

      <div className="spCard__footer">
        <div>
          <div className="spCard__price">
            {moneda}
            {precio.toFixed(2)}
          </div>

          <div className="spCard__iva">IVA {iva}%</div>
        </div>

        <div className="spCard__totalContainer">
          <div className="spCard__totalLabel">Total con IVA</div>

          <div className="spCard__total">
            {moneda}
            {total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
