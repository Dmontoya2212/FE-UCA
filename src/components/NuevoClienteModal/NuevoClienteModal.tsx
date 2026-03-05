import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import style from '@components/NuevoClienteModal/NuevoClienteModal.module.css';
import { FaXmark, FaRegFloppyDisk } from 'react-icons/fa6';

type NuevoClieneteModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

type NuevoClienteForm = {
  nombre: string;
  nit: string;
  email: string;
  direccion: string;
  departamento: string;
  codigoPostal: string;
  telefono: string;
};

const NuevoClienteModal = ({ isOpen, setIsOpen }: NuevoClieneteModalProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [formData, setFormData] = useState<NuevoClienteForm>({
    nombre: '',
    nit: '',
    email: '',
    direccion: '',
    departamento: '',
    codigoPostal: '',
    telefono: '',
  });

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      nit: '',
      email: '',
      direccion: '',
      departamento: '',
      codigoPostal: '',
      telefono: '',
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    console.log('datos enviados', formData);

    setFormData({
      nombre: '',
      nit: '',
      email: '',
      direccion: '',
      departamento: '',
      codigoPostal: '',
      telefono: '',
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
            <h4 className={`${style.title}`}>Nuevo Cliente</h4>
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
                  Nombre/Razon Social
                  <input
                    className={`${style.inputForm}`}
                    placeholder={`Empresa S.A de C.V`}
                    type={'text'}
                    name={'nombre'}
                    value={formData.nombre}
                    required={true}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className={`${style.wrapper}`}>
                <label className={`${style.labelForm}`}>
                  NIT
                  <input
                    className={`${style.inputForm}`}
                    placeholder={`1234567890`}
                    type={'text'}
                    name={'nit'}
                    value={formData.nit}
                    required={true}
                    onChange={handleChange}
                  />
                </label>
                <label className={`${style.labelForm}`}>
                  Email
                  <input
                    className={`${style.inputForm}`}
                    placeholder={`correo@ejemplo.com`}
                    type={`email`}
                    name={'email'}
                    value={formData.email}
                    required={true}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className={`${style.wrapper}`}>
                <label className={`${style.labelForm} ${style.full}`}>
                  Direccion
                  <input
                    className={`${style.inputForm}`}
                    placeholder={`Calle, Av, Municipio`}
                    type={'text'}
                    name={'direccion'}
                    value={formData.direccion}
                    required={true}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className={`${style.wrapper}`}>
                <label className={`${style.labelForm}`}>
                  Departamento
                  <input
                    className={`${style.inputForm}`}
                    placeholder={`San Salvador`}
                    type={'text'}
                    name={'departamento'}
                    value={formData.departamento}
                    required={true}
                    onChange={handleChange}
                  />
                </label>
                <label className={`${style.labelForm}`}>
                  Codigo Postal
                  <input
                    className={`${style.inputForm}`}
                    placeholder={`00000`}
                    type={`number`}
                    name={'codigoPostal'}
                    value={formData.codigoPostal}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className={`${style.wrapper}`}>
                <label className={`${style.labelForm}`}>
                  Telefono
                  <input
                    className={`${style.inputForm}`}
                    placeholder={`1234-5678`}
                    type={`number`}
                    name={'telefono'}
                    value={formData.telefono}
                    required={true}
                    onChange={handleChange}
                  />
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

export default NuevoClienteModal;
