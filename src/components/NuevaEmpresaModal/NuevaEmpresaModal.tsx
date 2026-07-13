import { authFetch } from '../../utils/auth';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import style from '@components/NuevaEmpresaModal/NuevaEmpresaModal.module.css';
import { FaXmark, FaRegFloppyDisk, FaEye, FaEyeSlash } from 'react-icons/fa6';

type NuevaEmpresaModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onCreated?: () => void;
};

type NuevaEmpresaForm = {
  razonSocial: string;
  nombreLegal: string;
  nombreComercial: string;
  nit: string;
  registro: string;
  actividadEconomica: string;
  sectorEmpresa: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  usuario: string;
  password: string;
  clavePrimaria: string;
  token: string;
  expireToken: string;
};

const INITIAL_FORM: NuevaEmpresaForm = {
  razonSocial: '',
  nombreLegal: '',
  nombreComercial: '',
  nit: '',
  registro: '',
  actividadEconomica: '',
  sectorEmpresa: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  codigoPostal: '',
  pais: '',
  usuario: '',
  password: '',
  clavePrimaria: '',
  token: '',
  expireToken: '',
};

const API_BASE = 'http://localhost:8080/api/v1/facturacion/empresa';

const NuevaEmpresaModal = ({
  isOpen,
  setIsOpen,
  onCreated,
}: NuevaEmpresaModalProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [formData, setFormData] = useState<NuevaEmpresaForm>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showClave, setShowClave] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    handleCloseDialog();
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.nombreLegal.trim() || !formData.nit.trim()) {
      return;
    }

    const body = {
      razon_social: formData.razonSocial || undefined,
      nombre_legal: formData.nombreLegal,
      nombre_comercial: formData.nombreComercial || undefined,
      nit: formData.nit,
      registro: formData.registro || undefined,
      actividad_economica: formData.actividadEconomica || undefined,
      sector_empresa: formData.sectorEmpresa || undefined,
      email: formData.email || undefined,
      telefono: formData.telefono || undefined,
      direccion: formData.direccion || undefined,
      ciudad: formData.ciudad || undefined,
      codigo_postal: formData.codigoPostal || undefined,
      pais: formData.pais || undefined,
      usuario: formData.usuario || undefined,
      password: formData.password || undefined,
      clave_primaria: formData.clavePrimaria || undefined,
      token: formData.token || undefined,
      expire_token: formData.expireToken || undefined,
    };

    try {
      setSaving(true);
      const res = await authFetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Error al crear empresa:', err);
        alert(
          typeof err.data === 'string'
            ? err.data
            : 'Error al crear la empresa',
        );
        return;
      }

      setFormData(INITIAL_FORM);
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
        <article className={style.bodyDialog}>
          <section className={style.headerSection}>
            <h4 className={style.title}>Nueva Empresa</h4>
            <FaXmark
              className={`${style.icon} ${style.iconClose}`}
              title="Cerrar"
              onClick={handleCloseDialog}
            />
          </section>

          <section className={style.formSection}>
            <form className={style.dialogForm}>
              {/* ── IDENTIFICACIÓN ── */}
              <p className={style.sectionLabel}>IDENTIFICACIÓN</p>

              <div className={style.wrapper}>
                <label className={`${style.labelForm} ${style.full}`}>
                  Razón Social
                  <span className={style.required}>*</span>
                  <input
                    className={style.inputForm}
                    placeholder="Ej: Mi Empresa S.A.S."
                    type="text"
                    name="razonSocial"
                    value={formData.razonSocial}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className={style.wrapper}>
                <label className={style.labelForm}>
                  Nombre Legal
                  <input
                    className={style.inputForm}
                    placeholder="Nombre legal registrado"
                    type="text"
                    name="nombreLegal"
                    value={formData.nombreLegal}
                    required
                    onChange={handleChange}
                  />
                </label>
                <label className={style.labelForm}>
                  Nombre Comercial
                  <input
                    className={style.inputForm}
                    placeholder="Nombre que usa públicamente"
                    type="text"
                    name="nombreComercial"
                    value={formData.nombreComercial}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className={style.wrapper}>
                <label className={style.labelForm}>
                  NIT/NIF
                  <span className={style.required}>*</span>
                  <input
                    className={style.inputForm}
                    placeholder="Ej: 0614-123456-101-1"
                    type="text"
                    name="nit"
                    value={formData.nit}
                    required
                    onChange={handleChange}
                  />
                </label>
                <label className={style.labelForm}>
                  Registro
                  <input
                    className={style.inputForm}
                    placeholder="Ej: 12345678"
                    type="text"
                    name="registro"
                    value={formData.registro}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className={style.wrapper}>
                <label className={style.labelForm}>
                  Actividad Económica
                  <input
                    className={style.inputForm}
                    placeholder="Ej: Desarrollo de software"
                    type="text"
                    name="actividadEconomica"
                    value={formData.actividadEconomica}
                    onChange={handleChange}
                  />
                </label>
                <label className={style.labelForm}>
                  Sector de Empresa
                  <input
                    className={style.inputForm}
                    placeholder="Ej: Tecnología, Comercio, Salud"
                    type="text"
                    name="sectorEmpresa"
                    value={formData.sectorEmpresa}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {/* ── CONTACTO ── */}
              <p className={style.sectionLabel}>CONTACTO</p>

              <div className={style.wrapper}>
                <label className={style.labelForm}>
                  Email
                  <input
                    className={style.inputForm}
                    placeholder="info@miempresa.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </label>
                <label className={style.labelForm}>
                  Teléfono
                  <input
                    className={style.inputForm}
                    placeholder="+503 7890 1234"
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {/* ── DIRECCIÓN ── */}
              <p className={style.sectionLabel}>DIRECCIÓN</p>

              <div className={style.wrapper}>
                <label className={`${style.labelForm} ${style.full}`}>
                  Dirección
                  <input
                    className={style.inputForm}
                    placeholder="Calle, número, barrio"
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className={style.wrapper}>
                <label className={style.labelForm}>
                  Ciudad
                  <input
                    className={style.inputForm}
                    placeholder="San Salvador"
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                  />
                </label>
                <label className={style.labelForm}>
                  Código Postal
                  <input
                    className={style.inputForm}
                    placeholder="01101"
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className={style.wrapper}>
                <label className={style.labelForm}>
                  País
                  <input
                    className={style.inputForm}
                    placeholder="El Salvador"
                    type="text"
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {/* ── CREDENCIALES DE ACCESO ── */}
              <p className={style.sectionLabel}>CREDENCIALES DE ACCESO</p>

              <div className={style.wrapper}>
                <label className={style.labelForm}>
                  Usuario
                  <input
                    className={style.inputForm}
                    placeholder="usuario@empresa"
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                  />
                </label>
                <label className={style.labelForm}>
                  Contraseña
                  <div className={style.passwordWrap}>
                    <input
                      className={`${style.inputForm} ${style.passwordInput}`}
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className={style.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                      <span className={style.toggleText}>Ver</span>
                    </button>
                  </div>
                </label>
              </div>

              <div className={style.wrapper}>
                <label className={`${style.labelForm} ${style.full}`}>
                  Clave Primaria
                  <div className={style.passwordWrap}>
                    <input
                      className={`${style.inputForm} ${style.passwordInput}`}
                      placeholder="••••••••••••••••••••"
                      type={showClave ? 'text' : 'password'}
                      name="clavePrimaria"
                      value={formData.clavePrimaria}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className={style.togglePassword}
                      onClick={() => setShowClave(!showClave)}
                      tabIndex={-1}
                    >
                      {showClave ? <FaEyeSlash /> : <FaEye />}
                      <span className={style.toggleText}>Ver</span>
                    </button>
                  </div>
                </label>
              </div>

              {/* ── TOKENS ── */}
              <p className={style.sectionLabel}>TOKENS</p>

              <div className={style.wrapper}>
                <label className={`${style.labelForm} ${style.full}`}>
                  Token
                  <input
                    className={style.inputForm}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    type="text"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className={style.wrapper}>
                <label className={style.labelForm}>
                  Expire Token
                  <input
                    className={style.inputForm}
                    placeholder="Ej: 2025-12-31 o 3600"
                    type="text"
                    name="expireToken"
                    value={formData.expireToken}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </form>
          </section>

          <section className={style.actionButtonsSection}>
            <button
              type="reset"
              className={`${style.button} ${style.cancelButton}`}
              title="Cancelar"
              onClick={handleReset}
            >
              <FaXmark
                className={`${style.icon} ${style.iconReset}`}
                title="Cancelar"
              />
              Cancelar
            </button>

            <button
              type="button"
              className={`${style.button} ${style.saveButton}`}
              title="Guardar empresa"
              onClick={handleSubmit}
              disabled={saving}
            >
              <FaRegFloppyDisk
                className={`${style.icon} ${style.iconSave}`}
                title="Guardar"
              />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </section>
        </article>
      </dialog>
    </>
  );
};

export default NuevaEmpresaModal;
