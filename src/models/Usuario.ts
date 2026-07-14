export interface UsuarioRequest {
  empresaIds: string[]; // UUIDs
  nombre: string;
  email: string;
  password?: string;
  esAdmin?: boolean;
  rol: string;
}

export interface UsuarioUpdateRequest {
  nombre?: string;
  email?: string;
  esAdmin?: boolean;
  activo?: boolean;
  password?: string;
  rol?: string;
  empresaIds?: string[];
}

export interface UsuarioResponse {
  id: string;
  empresaIds: string[];

  nombre: string;
  email: string;

  esAdmin?: boolean;
  rol: string;
  activo?: boolean;

  created_at: string;
  updated_at?: string;
}
