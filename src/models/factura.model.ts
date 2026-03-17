export type Factura = {
    id: string;
    empresaId: string;
    clienteId?: string;
    clienteNombre?: string;   // para mostrar en tabla
    numero: string;
    fechaEmision: string;
    fechaVencimiento?: string;
    estado: 'BORRADOR' | 'ENVIADA' | 'PAGADA';
    monedaCodigo?: string;
    subtotalSinIva?: number;
    totalIva?: number;
    totalConIva?: number;
};