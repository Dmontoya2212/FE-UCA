import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import DropDown from '@components/DropDown/DropDown.tsx';
import style from '@components/NuevoServicioModal/NuevoServicioModal.module.css';
// import DropDown from "../DropDown/DropDown";
// import style from "./NuevoServicioModal.module.css";
import { FaRegFloppyDisk, FaXmark, FaDollarSign } from 'react-icons/fa6';

type NuevoServicioModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

type NuevoServicioForm = {
  nombre: string;
  descripcion: string;
  categoria: string;
  iva: string;
  precio: string;
};

const categorias = [
  { value: 'servicio', label: 'Servicio' },
  { value: 'producto', label: 'Producto' },
  { value: 'consultoria', label: 'Consultoría' },
  { value: 'otro', label: 'Otro' },
];

const ivaOptions = [
  { value: '13', label: '13% - General' },
  { value: '0', label: '0% - Exento' },
];

const NuevoServicioModal = ({ isOpen, setIsOpen }: NuevoServicioModalProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [formData, setFormData] = useState<NuevoServicioForm>({
    nombre: '',
    descripcion: '',
    categoria: 'servicio',
    iva: '13',
    precio: '',
  });

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: 'servicio',
      iva: '13',
      precio: '',
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    console.log('datos enviados', formData);

    setFormData({
      nombre: '',
      descripcion: '',
      categoria: 'servicio',
      iva: '13',
      precio: '',
    });
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
                  Nombre
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
                  IVA (%)
                  <DropDown
                    options={ivaOptions}
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
            >
              <FaRegFloppyDisk
                className={`${style.icon} ${style.iconSave}`}
                title={`Cerrar`}
              />
              Guardar
            </button>
          </section>
        </article>
      </dialog>
    </>
  );
};

export default NuevoServicioModal;
