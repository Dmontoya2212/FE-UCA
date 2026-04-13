export interface AddMonedaRequest {
  codigo_moneda: string[];
}

export interface MonedaResponse {
  codigo: string;
  nombre: string;
  simbolo: string;
}
