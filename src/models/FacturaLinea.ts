export interface FacturaLineaRequest {
  facturaId: string; // UUID
  itemId?: string; // UUID

  descripcion: string;

  cantidad: number;
  precioSinIva: number;
  ivaPorcentaje: number;
}

export interface FacturaLineaUpdateRequest {
  itemId?: string;
  descripcion?: string;

  cantidad?: number;
  precioSinIva?: number;
  ivaPorcentaje?: number;
}

export interface FacturaLineaResponse {
  id: string;
  facturaId: string;
  itemId?: string;

  descripcion: string;

  cantidad: number;
  precioSinIva: number;
  ivaPorcentaje: number;

  subtotalSinIva: number;
  totalIva: number;
  totalConIva: number;

  createdAt: string;
  updatedAt?: string;
}
