export type FacturaEstado = 'BORRADOR' | 'EMITIDA' | 'PAGADA' | 'ANULADA';

export interface FacturaRequest {
  empresaId: string; // UUID
  clienteId?: string; // UUID
  numero: string;
  fechaEmision: string; // LocalDate → "YYYY-MM-DD"
  monedaCodigo?: string;
}

export interface FacturaUpdateRequest {
  clienteId?: string;
  numero?: string;
  fechaEmision?: string;
  monedaCodigo?: string;
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

  createdAt: string;
  updatedAt?: string;
}
