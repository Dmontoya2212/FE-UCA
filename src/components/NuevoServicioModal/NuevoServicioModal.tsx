import { authFetch } from '../../utils/auth';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import DropDown from '@components/DropDown/DropDown.tsx';
import style from '@components/NuevoServicioModal/NuevoServicioModal.module.css';
import { FaRegFloppyDisk, FaXmark, FaDollarSign } from 'react-icons/fa6';
import { useEmpresa } from '@context/EmpresaContext.tsx';
import { apiUrl } from '@/config/api';

type NuevoServicioModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onCreated?: () => void;
};

type NuevoServicioForm = {
  nombre: string;
  descripcion: string;
  categoria: string;
  iva: string;
  precio: string;
};

const categorias = [
  { value: 'SERVICIO', label: 'Servicio' },
  { value: 'PRODUCTO', label: 'Producto' },
  { value: 'CONSULTORIA', label: 'Consultoría' },
  { value: 'OTRO', label: 'Otro' },
];

const API_BASE = apiUrl('/api/v1/facturacion/item');
const IVA_API = apiUrl('/api/v1/facturacion/iva/empresa');
const IVA_CREATE_API = apiUrl('/api/v1/facturacion/iva');

const INITIAL_FORM: NuevoServicioForm = {
  nombre: '',
  descripcion: '',
  categoria: 'SERVICIO',
  iva: '',
  precio: '',
};

const NuevoServicioModal = ({ isOpen, setIsOpen, onCreated }: NuevoServicioModalProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const { selectedEmpresaId } = useEmpresa();
  const [formData, setFormData] = useState<NuevoServicioForm>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [ivaOptions, setIvaOptions] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    if (selectedEmpresaId) {
      const loadIvas = async () => {
        try {
          let res = await authFetch(`${IVA_API}/${selectedEmpresaId}`);
          let j = await res.json();
          let list = j.data ?? [];

          // Si la empresa no tiene IVAs configurados, "quemamos" o creamos el 13% por defecto automáticamente.
          if (list.length === 0) {
            await authFetch(IVA_CREATE_API, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                empresa_id: selectedEmpresaId,
                nombre: 'IVA El Salvador',
                porcentaje: 13
              })
            });
            // Recargar la lista después de crearlo
            res = await authFetch(`${IVA_API}/${selectedEmpresaId}`);
            j = await res.json();
            list = j.data ?? [];
          }

          const mapped = list.map((iva: { id: string; nombre: string; porcentaje: number }) => ({
            value: iva.id,
            label: `${iva.nombre} (${iva.porcentaje}%)`
          }));
          
          setIvaOptions(mapped);
          setFormData(prev => {
            if (mapped.length > 0 && !prev.iva) {
              return { ...prev, iva: mapped[0]?.value ?? '' };
            }
            return prev;
          });
        } catch (e) {
          console.error("Error al cargar/crear IVAs:", e);
        }
      };
      loadIvas();
    }
  }, [selectedEmpresaId]);

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      ...INITIAL_FORM,
      iva: ivaOptions[0]?.value ?? '',
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedEmpresaId) {
      alert("Debes seleccionar una empresa primero.");
      return;
    }

    if (!formData.nombre.trim() || !formData.precio) return;
    if (!formData.iva) {
      alert("Debes seleccionar un IVA. Si no hay ninguno, créalo primero.");
      return;
    }

    const payload = {
      empresa_id: selectedEmpresaId,
      nombre: formData.nombre,
      descripcion: formData.descripcion || formData.nombre,
      categoria: formData.categoria,
      iva_id: formData.iva,
      precio_sin_iva: parseFloat(formData.precio),
      activo: true
    };

    try {
      setSaving(true);
      const res = await authFetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Error al crear servicio:', err);
        alert(typeof err.data === 'string' ? err.data : (Array.isArray(err.data) ? err.data[0] : 'Error al crear el servicio/producto'));
        return;
      }

      handleReset();
      setIsOpen(false);
      onCreated?.();
    } catch (err) {
      console.error('Error de red:', err);
      alert('No se pudo conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current?.showModal();
    } else {
      setTimeout(() => {
        dialogRef.current?.close();
      }, 300);
    }
  }, [isOpen]);

  return (
    <>
      <dialog
        ref={dialogRef}
        className={`${style.dialog} ${isOpen ? style.openDialog : style.closeDialog}`}
        onClose={handleCloseDialog}
        onClick={(e) => {
          if (e.target === dialogRef.current) handleCloseDialog();
        }}
      >
        <article className={`${style.bodyDialog}`}>
          <section className={`${style.headerSection}`}>
            <h4 className={`${style.title}`}>Nuevo Servicio/Producto</h4>

            <FaXmark
              className={`${style.icon} ${style.iconClose}`}
              title={`Cerrar`}
              onClick={handleCloseDialog}
            />
          </section>

          <section className={`${style.formSection}`}>
            <form className={`${style.dialogForm}`}>
              <div className={`${style.wrapper}`}>
                <label className={`${style.labelForm} ${style.full}`}>
                  Nombre / Código
                  <input
                    className={`${style.inputForm}`}
                    placeholder={`Ej: Consultoría IT, Desarrollo Web, Producto X`}
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    required={true}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className={`${style.wrapper}`}>
                <label className={`${style.labelForm} ${style.full}`}>
                  Descripción
                  <textarea
                    className={`${style.inputForm} ${style.textareaForm}`}
                    placeholder={`Descripción detallada del servicio o producto`}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className={`${style.wrapper}`}>
                <label className={`${style.labelForm}`}>
                  Categoría
                  <DropDown
                    options={categorias}
                    value={formData.categoria}
                    onChange={(value: string) => {
                      setFormData((prevData: NuevoServicioForm) => ({
                        ...prevData,
                        categoria: value,
                      }));
                    }}
                  />
                </label>

                <label className={`${style.labelForm}`}>
                  IVA
                  <DropDown
                    options={ivaOptions.length > 0 ? ivaOptions : [{value: '', label: 'Cargando IVAs...'}]}
                    value={formData.iva}
                    onChange={(value: string) => {
                      setFormData((prev: NuevoServicioForm) => ({
                        ...prev,
                        iva: value,
                      }));
                    }}
                  />
                </label>
              </div>

              <div className={`${style.wrapper}`}>
                <label className={`${style.labelForm} ${style.full}`}>
                  Precio (sin IVA)
                  <div className={style.inputWithIcon}>
                    {formData.precio && (
                      <FaDollarSign className={style.inputIcon} />
                    )}

                    <input
                      className={`${style.inputForm} ${style.inputPrice}`}
                      placeholder="0"
                      type="number"
                      name="precio"
                      value={formData.precio}
                      required
                      onChange={handleChange}
                    />
                  </div>
                </label>
              </div>
            </form>
          </section>

          <section className={`${style.actionButtonsSection}`}>
            <button
              type={'reset'}
              className={`${style.button} ${style.cancelButton}`}
              title={'Eliminar datos ingresados'}
              onClick={handleReset}
            >
              <FaXmark
                className={`${style.icon} ${style.iconReset}`}
                title={`Cerrar`}
              />
              Cancelar
            </button>

            <button
              type={'button'}
              className={`${style.button} ${style.saveButton}`}
              title={'Enviar datos'}
              onClick={handleSubmit}
              disabled={saving}
            >
              <FaRegFloppyDisk
                className={`${style.icon} ${style.iconSave}`}
                title={`Cerrar`}
              />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </section>
        </article>
      </dialog>
    </>
  );
};

export default NuevoServicioModal;
