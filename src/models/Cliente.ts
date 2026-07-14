export interface ClienteRequest {
  empresa_id: string; // UUID
  nombre_razon_social: string;
  nif_cif?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  telefono?: string;
  activo?: boolean;
}

export interface ClienteUpdateRequest {
  nombre_razon_social?: string;
  nif_cif?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  telefono?: string;
  activo?: boolean;
}

export interface ClienteResponse {
  id: string; // UUID
  
  empresa_id?: string; // UUID
  empresaId?: string;

  nombre_razon_social?: string;
  nombreRazonSocial?: string;

  nif_cif?: string;
  nifCif?: string;

  email?: string;
  direccion?: string;
  ciudad?: string;

  codigo_postal?: string;
  codigoPostal?: string;

  telefono?: string;
  activo?: boolean;

  created_at?: string; // ISO date
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;

  deleted_at?: string;
  deletedAt?: string;
}
