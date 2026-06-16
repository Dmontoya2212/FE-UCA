import type { MonedaResponse } from '@models/Moneda.ts';

export interface EmpresaRequest {
  razon_social?: string;
  nombre_legal: string;
  nombre_comercial?: string;
  nit: string;
  registro?: string;
  actividad_economica?: string;
  sector_empresa?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  pais?: string;
  usuario?: string;
  password?: string;
  clave_primaria?: string;
  token?: string;
  expire_token?: string;
}

export interface EmpresaUpdateRequest {
  razon_social?: string;
  nombre_legal?: string;
  nombre_comercial?: string;
  nit?: string;
  registro?: string;
  actividad_economica?: string;
  sector_empresa?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  pais?: string;
  usuario?: string;
  password?: string;
  clave_primaria?: string;
  token?: string;
  expire_token?: string;
}

export interface EmpresaResponse {
  id: string;
  razon_social?: string;
  razonSocial?: string;
  nombre_legal?: string;
  nombreLegal?: string;
  nombre_comercial?: string;
  nombreComercial?: string;
  nit: string;
  registro?: string;
  actividad_economica?: string;
  actividadEconomica?: string;
  sector_empresa?: string;
  sectorEmpresa?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  codigoPostal?: string;
  pais?: string;
  usuario?: string;
  token?: string;
  expire_token?: string;
  expireToken?: string;
  monedas: MonedaResponse[];
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}
