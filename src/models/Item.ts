export type ItemCategoria = 'PRODUCTO' | 'SERVICIO' | 'CONSULTORIA' | 'OTRO';

export interface ItemRequest {
  empresa_id: string; // UUID
  nombre: string;

  descripcion?: string;

  categoria: ItemCategoria;

  iva_id: string; // UUID
  precio_sin_iva: number;

  activo?: boolean;
}

export interface ItemUpdateRequest {
  nombre?: string;
  descripcion?: string;

  categoria?: ItemCategoria;

  iva_id?: string;
  precio_sin_iva?: number;

  activo?: boolean;
}

export interface ItemResponse {
  id: string;
  empresa_id: string;

  nombre: string;
  descripcion?: string;

  categoria: ItemCategoria;

  iva_id: string;
  iva_porcentaje_snapshot: number;

  precio_sin_iva: number;

  activo?: boolean;

  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
