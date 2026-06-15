import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import DropDown from '../DropDown/DropDown';
import { FaXmark, FaRegFloppyDisk, FaPlus, FaTrash } from 'react-icons/fa6';
import style from './NuevaFacturaModal.module.css';
import type { ClienteResponse } from '@models/Cliente.ts';
import { useEmpresa } from '@context/EmpresaContext.tsx';

type NuevaFacturaModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  clientes?: ClienteResponse[];
  servicios?: { id: string; nombre: string; descripcion?: string; precio_sin_iva: number; iva: { porcentaje: number } }[];
  onCreated?: () => void;
};

type FacturaCabecera = {
  numero: string;
  clienteId: string;
  fechaEmision: string;
  monedaCodigo: string;
};

type FacturaLinea = {
  itemId: string;
  descripcion: string;
  cantidad: string;
  precioSinIva: string;
  ivaPorcentaje: string;
};

const monedaOptions = [
  { value: 'USD', label: 'USD - Dólar' },
  { value: 'EUR', label: 'EUR - Euro' },
];

const ivaOptions = [
  { value: '13', label: '13%' },
  { value: '0', label: '0%' },
];

const API_BASE = 'http://localhost:8080/api/v1/facturacion/factura';

const lineaVacia = (): FacturaLinea => ({
  itemId: '',
  descripcion: '',
  cantidad: '1',
  precioSinIva: '',
  ivaPorcentaje: '13',
});

const getTodayLocal = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

export default function NuevaFacturaModal({
  isOpen,
  setIsOpen,
  onCreated,
  clientes = [],
  servicios = [],
}: NuevaFacturaModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const { selectedEmpresaId } = useEmpresa();
  const [saving, setSaving] = useState(false);

  const [cabecera, setCabecera] = useState<FacturaCabecera>({
    numero: '',
    clienteId: '',
    fechaEmision: getTodayLocal(), // Default today locally
    monedaCodigo: 'USD',
  });

  const [lineas, setLineas] = useState<FacturaLinea[]>([lineaVacia()]);

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
    else setTimeout(() => dialogRef.current?.close(), 300);
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  const handleCabeceraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCabecera((prev) => ({ ...prev, [name]: value }));
  };

  const handleLineaChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setLineas((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [name]: value } : l)),
    );
  };

  const handleItemSelect = (index: number, itemId: string) => {
    const selectedItem = servicios.find(s => s.id === itemId);
    setLineas(prev => prev.map((l, i) => {
      if (i === index) {
        if (!selectedItem) {
          return { ...l, itemId: '' };
        }
        return {
          ...l,
          itemId: selectedItem.id,
          descripcion: selectedItem.nombre || selectedItem.descripcion || '',
          precioSinIva: String(selectedItem.precio_sin_iva || 0),
          ivaPorcentaje: selectedItem.iva ? String(selectedItem.iva.porcentaje >= 1 ? selectedItem.iva.porcentaje : selectedItem.iva.porcentaje * 100) : '13'
        };
      }
      return l;
    }));
  };

  const agregarLinea = () => setLineas((prev) => [...prev, lineaVacia()]);

  const eliminarLinea = (index: number) =>
    setLineas((prev) => prev.filter((_, i) => i !== index));

  const calcularTotal = (linea: FacturaLinea) => {
    const cant = parseFloat(linea.cantidad) || 0;
    const precio = parseFloat(linea.precioSinIva) || 0;
    const iva = parseFloat(linea.ivaPorcentaje) || 0;
    const subtotal = cant * precio;
    return subtotal * (1 + iva / 100);
  };

  const totalFactura = lineas.reduce((acc, l) => acc + calcularTotal(l), 0);

  const handleReset = () => {
    setCabecera({
      numero: '',
      clienteId: '',
      fechaEmision: getTodayLocal(),
      monedaCodigo: 'USD',
    });
    setLineas([lineaVacia()]);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedEmpresaId) {
      alert("Selecciona una empresa primero");
      return;
    }

    if (!cabecera.numero || !cabecera.fechaEmision) return;

    // Remove empty lines
    const validLines = lineas.filter(l => l.descripcion.trim() !== '' && l.precioSinIva !== '');
    if (validLines.length === 0) {
      alert("Agrega al menos una línea a la factura.");
      return;
    }

    const payload = {
      empresaId: selectedEmpresaId,
      clienteId: cabecera.clienteId || undefined,
      numero: cabecera.numero,
      fechaEmision: cabecera.fechaEmision,
      moneda_codigo: cabecera.monedaCodigo,
      lineas: validLines.map(l => ({
        item_id: l.itemId || undefined,
        descripcion: l.descripcion,
        cantidad: parseFloat(l.cantidad) || 1,
        precio_sin_iva: parseFloat(l.precioSinIva),
        iva_porcentaje: parseFloat(l.ivaPorcentaje)
      }))
    };

    try {
      setSaving(true);
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Error al crear factura:', err);
        alert(typeof err.data === 'string' ? err.data : 'Error al crear la factura');
        return;
      }

      handleReset();
      handleClose();
      onCreated?.();
    } catch (err) {
      console.error('Error de red:', err);
      alert('No se pudo conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const servicioOptions = [
    { value: '', label: 'Seleccionar (Opcional)' },
    ...servicios.map(s => ({ value: s.id, label: s.nombre }))
  ];

  return (
    <dialog
      ref={dialogRef}
      className={`${style.dialog} ${isOpen ? style.openDialog : style.closeDialog}`}
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      <article className={style.bodyDialog}>
        {/* HEADER */}
        <section className={style.headerSection}>
          <h4 className={style.title}>Nueva Factura</h4>
          <FaXmark
            className={`${style.icon} ${style.iconClose}`}
            onClick={handleClose}
          />
        </section>

        <section className={style.formSection}>
          {/* CABECERA */}
          <p className={style.groupLabel}>Datos de la factura</p>
          <div className={style.wrapper}>
            <label className={style.labelForm}>
              Número de factura
              <input
                className={style.inputForm}
                placeholder="F-000001"
                type="text"
                name="numero"
                value={cabecera.numero}
                onChange={handleCabeceraChange}
                required
              />
            </label>

            <label className={style.labelForm}>
              Fecha de emisión
              <input
                className={style.inputForm}
                type="date"
                name="fechaEmision"
                value={cabecera.fechaEmision}
                onChange={handleCabeceraChange}
                required
              />
            </label>

            <label className={style.labelForm}>
              Cliente (opcional)
              <DropDown
                options={[
                  { value: '', label: 'Sin cliente' },
                  ...clientes.map((c) => ({
                    value: c.id,
                    label: c.nombreRazonSocial,
                  })),
                ]}
                value={cabecera.clienteId}
                placeholder="Selecciona un cliente"
                onChange={(v) =>
                  setCabecera((prev) => ({ ...prev, clienteId: v }))
                }
              />
            </label>

            <label className={style.labelForm}>
              Moneda
              <DropDown
                options={monedaOptions}
                value={cabecera.monedaCodigo}
                onChange={(v) =>
                  setCabecera((prev) => ({ ...prev, monedaCodigo: v }))
                }
              />
            </label>
          </div>

          {/* LÍNEAS */}
          <div className={style.lineasHeader}>
            <p className={style.groupLabel}>Líneas de detalle</p>
            <button
              type="button"
              className={style.addLineaBtn}
              onClick={agregarLinea}
            >
              <FaPlus /> Agregar línea
            </button>
          </div>

          <div className={style.lineasContainer}>
            {lineas.map((linea, index) => (
              <div key={index} className={style.lineaRow}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <label className={`${style.labelForm}`}>
                    {index === 0 && <span>Servicio/Producto</span>}
                    <DropDown
                      options={servicioOptions}
                      value={linea.itemId}
                      onChange={(v) => handleItemSelect(index, v)}
                    />
                  </label>
                  <label className={`${style.labelForm}`}>
                    <input
                      className={style.inputForm}
                      placeholder="Descripción personalizada"
                      type="text"
                      name="descripcion"
                      value={linea.descripcion}
                      onChange={(e) => handleLineaChange(index, e)}
                      required
                    />
                  </label>
                </div>

                <label className={`${style.labelForm} ${style.colSmall}`}>
                  {index === 0 && <span>Cantidad</span>}
                  <input
                    className={style.inputForm}
                    placeholder="1"
                    type="number"
                    name="cantidad"
                    value={linea.cantidad}
                    onChange={(e) => handleLineaChange(index, e)}
                    required
                  />
                </label>

                <label className={`${style.labelForm} ${style.colSmall}`}>
                  {index === 0 && <span>Precio s/IVA</span>}
                  <input
                    className={style.inputForm}
                    placeholder="0.00"
                    type="number"
                    name="precioSinIva"
                    value={linea.precioSinIva}
                    onChange={(e) => handleLineaChange(index, e)}
                    required
                  />
                </label>

                <label className={`${style.labelForm} ${style.colSmall}`}>
                  {index === 0 && <span>IVA</span>}
                  <DropDown
                    options={ivaOptions}
                    value={linea.ivaPorcentaje}
                    onChange={(v) =>
                      setLineas((prev) =>
                        prev.map((l, i) =>
                          i === index ? { ...l, ivaPorcentaje: v } : l,
                        ),
                      )
                    }
                  />
                </label>

                <label className={`${style.labelForm} ${style.colSmall}`}>
                  {index === 0 && <span>Total</span>}
                  <input
                    className={`${style.inputForm} ${style.inputReadonly}`}
                    value={`$${calcularTotal(linea).toFixed(2)}`}
                    readOnly
                  />
                </label>

                <div className={style.colAction}>
                  {index === 0 && (
                    <span className={style.colActionLabel}>&nbsp;</span>
                  )}
                  <button
                    type="button"
                    className={style.deleteLineaBtn}
                    onClick={() => eliminarLinea(index)}
                    disabled={lineas.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className={style.totalRow}>
            <span className={style.totalLabel}>Total con IVA</span>
            <span className={style.totalValue}>${totalFactura.toFixed(2)}</span>
          </div>
        </section>

        {/* ACCIONES */}
        <section className={style.actionButtonsSection}>
          <button
            type="button"
            className={`${style.button} ${style.cancelButton}`}
            onClick={() => {
              handleReset();
              handleClose();
            }}
          >
            <FaXmark className={style.icon} /> Cancelar
          </button>
          <button
            type="button"
            className={`${style.button} ${style.saveButton}`}
            onClick={handleSubmit}
            disabled={saving}
          >
            <FaRegFloppyDisk className={style.icon} /> {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </section>
      </article>
    </dialog>
  );
}

