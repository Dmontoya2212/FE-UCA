export interface IvaTasaRequest {
  empresa_id: string; // UUID
  nombre: string;
  porcentaje: number;
}

export interface IvaTasaUpdateRequest {
  nombre?: string;
  porcentaje?: number;
}

export interface IvaTasaResponse {
  id: string;
  empresa_id: string;

  nombre: string;
  porcentaje: number;

  created_at: string;
  updated_at?: string;
}
