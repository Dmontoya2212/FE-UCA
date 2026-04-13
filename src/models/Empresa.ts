import type { MonedaResponse } from '@models/Moneda.ts';

export interface EmpresaRequest {
  nombre_legal: string;
  nombre_comercial?: string;
  nif_cif?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
}

export interface EmpresaUpdateRequest {
  nombre_legal?: string;
  nombre_comercial?: string;
  nif_cif?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
}

export interface EmpresaResponse {
  id: string; // UUID
  nombre_legal: string;
  nombre_comercial?: string;
  nif_cif?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  pais?: string;

  created_at: string;

  monedas: MonedaResponse[];
}
