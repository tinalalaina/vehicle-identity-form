export interface Option {
  label: string;
  value: string;
}

export interface VehicleFormState {
  title: string;
  brand: string;
  model: string;
  year: string;
  bodyType: string;
  engine: string;
}

export enum FetchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}