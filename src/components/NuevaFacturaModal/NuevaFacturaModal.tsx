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
import type { Cliente } from '../../models/cliente.model';

type NuevaFacturaModalProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    clientes?: Cliente[];
    onGuardar?: (cabecera: FacturaCabecera, lineas: FacturaLinea[]) => void;
};



type FacturaCabecera = {
    numero: string;
    clienteId: string;
    fechaEmision: string;
    monedaCodigo: string;
};

type FacturaLinea = {
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

const lineaVacia = (): FacturaLinea => ({
    descripcion: '',
    cantidad: '',
    precioSinIva: '',
    ivaPorcentaje: '13',
});

export default function NuevaFacturaModal({ isOpen, setIsOpen, onGuardar, clientes = [] }: NuevaFacturaModalProps) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const [cabecera, setCabecera] = useState<FacturaCabecera>({
        numero: '',
        clienteId: '',
        fechaEmision: '',
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
        setCabecera(prev => ({ ...prev, [name]: value }));
    };

    const handleLineaChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setLineas(prev =>
            prev.map((l, i) => (i === index ? { ...l, [name]: value } : l))
        );
    };

    const agregarLinea = () => setLineas(prev => [...prev, lineaVacia()]);

    const eliminarLinea = (index: number) =>
        setLineas(prev => prev.filter((_, i) => i !== index));

    const calcularTotal = (linea: FacturaLinea) => {
        const cant = parseFloat(linea.cantidad) || 0;
        const precio = parseFloat(linea.precioSinIva) || 0;
        const iva = parseFloat(linea.ivaPorcentaje) || 0;
        const subtotal = cant * precio;
        return subtotal * (1 + iva / 100);
    };

    const totalFactura = lineas.reduce((acc, l) => acc + calcularTotal(l), 0);

    const handleReset = () => {
        setCabecera({ numero: '', clienteId: '', fechaEmision: '', monedaCodigo: 'USD' });
        setLineas([lineaVacia()]);
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onGuardar?.(cabecera, lineas);
        handleReset();
        handleClose();
    };

    return (
        <dialog
            ref={dialogRef}
            className={`${style.dialog} ${isOpen ? style.openDialog : style.closeDialog}`}
            onClose={handleClose}
            onClick={(e) => { if (e.target === dialogRef.current) handleClose(); }}
        >
            <article className={style.bodyDialog}>

                {/* HEADER */}
                <section className={style.headerSection}>
                    <h4 className={style.title}>Nueva Factura</h4>
                    <FaXmark className={`${style.icon} ${style.iconClose}`} onClick={handleClose} />
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
                                    ...clientes.map(c => ({ value: c.id, label: c.nombreRazonSocial }))
                                ]}
                                value={cabecera.clienteId}
                                placeholder="Selecciona un cliente"
                                onChange={(v) => setCabecera(prev => ({ ...prev, clienteId: v }))}
                            />
                        </label>

                        <label className={style.labelForm}>
                            Moneda
                            <DropDown
                                options={monedaOptions}
                                value={cabecera.monedaCodigo}
                                onChange={(v) => setCabecera(prev => ({ ...prev, monedaCodigo: v }))}
                            />
                        </label>
                    </div>

                    {/* LÍNEAS */}
                    <div className={style.lineasHeader}>
                        <p className={style.groupLabel}>Líneas de detalle</p>
                        <button type="button" className={style.addLineaBtn} onClick={agregarLinea}>
                            <FaPlus /> Agregar línea
                        </button>
                    </div>

                    <div className={style.lineasContainer}>
                        {lineas.map((linea, index) => (
                            <div key={index} className={style.lineaRow}>
                                <label className={`${style.labelForm} ${style.colDesc}`}>
                                    {index === 0 && <span>Descripción</span>}
                                    <input
                                        className={style.inputForm}
                                        placeholder="Servicio o producto"
                                        type="text"
                                        name="descripcion"
                                        value={linea.descripcion}
                                        onChange={(e) => handleLineaChange(index, e)}
                                        required
                                    />
                                </label>

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
                                            setLineas(prev =>
                                                prev.map((l, i) => (i === index ? { ...l, ivaPorcentaje: v } : l))
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
                                    {index === 0 && <span className={style.colActionLabel}>&nbsp;</span>}
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
                    <button type="button" className={`${style.button} ${style.cancelButton}`} onClick={() => { handleReset(); handleClose(); }}>
                        <FaXmark className={style.icon} /> Cancelar
                    </button>
                    <button type="button" className={`${style.button} ${style.saveButton}`} onClick={handleSubmit}>
                        <FaRegFloppyDisk className={style.icon} /> Guardar
                    </button>
                </section>

            </article>
        </dialog>
    );
}