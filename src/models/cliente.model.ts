export type ClienteApi = {
  id: string;
  empresa_id: string;

  nombre_razon_social: string;
  nif_cif?: string | null;
  email?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  codigo_postal?: string | null;
  telefono?: string | null;
  activo?: boolean | null;

  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};


export type Cliente = {
  id: string;
  empresaId: string;

  nombreRazonSocial: string;
  nifCif?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  telefono?: string;
  activo?: boolean;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

// Mapper 
/*export const mapClienteApiToCliente = (c: ClienteApi): Cliente => ({
  id: c.id,
  empresaId: c.empresa_id,
  nombreRazonSocial: c.nombre_razon_social,
  nifCif: c.nif_cif ?? undefined,
  email: c.email ?? undefined,
  direccion: c.direccion ?? undefined,
  ciudad: c.ciudad ?? undefined,
  codigoPostal: c.codigo_postal ?? undefined,
  telefono: c.telefono ?? undefined,
  activo: c.activo ?? undefined,
  createdAt: c.created_at ?? undefined,
  updatedAt: c.updated_at ?? undefined,
  deletedAt: c.deleted_at ?? undefined,
});*/