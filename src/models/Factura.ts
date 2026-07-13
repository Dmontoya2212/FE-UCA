export type FacturaEstado = 'BORRADOR' | 'EMITIDA' | 'PAGADA' | 'ANULADA';

export interface FacturaRequest {
  empresaId: string; // UUID
  clienteId?: string; // UUID
  numero: string;
  fechaEmision: string; // LocalDate → "YYYY-MM-DD"
  monedaCodigo?: string;
  tipoDte?: string;
}

export interface FacturaUpdateRequest {
  clienteId?: string;
  numero?: string;
  fechaEmision?: string;
  monedaCodigo?: string;
  tipoDte?: string;
}

export interface FacturaResponse {
  id: string;
  empresaId: string;
  clienteId?: string;

  numero: string;
  fechaEmision: string;

  estado: FacturaEstado;
  monedaCodigo?: string;

  subtotalSinIva: number;
  totalIva: number;
  totalConIva: number;

  tipoDte?: string;
  codigoGeneracion?: string;
  numeroControl?: string;
  selloRecibido?: string;
  fechaRecepcion?: string;

  createdAt: string;
  updatedAt?: string;
}

export interface Factura extends FacturaResponse {
  clienteNombre?: string;
  fechaVencimiento?: string;
}
