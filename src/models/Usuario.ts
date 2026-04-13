export interface UsuarioRequest {
  empresaId: string; // UUID
  nombre: string;
  email: string;
  password: string;
  esAdmin?: boolean;
}

export interface UsuarioUpdateRequest {
  nombre?: string;
  email?: string;
  esAdmin?: boolean;
  activo?: boolean;
  password?: string;
}

export interface UsuarioResponse {
  id: string;
  empresa_id: string;

  nombre: string;
  email: string;

  es_admin?: boolean;
  activo?: boolean;

  created_at: string;
  updated_at?: string;
}
