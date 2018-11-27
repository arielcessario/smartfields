export interface Permiso {
  permisoId: number;
  moduleId: number;
  module: string;
  accessId: number;
  access: string;
  selected: boolean;
}

export interface Establecimiento {
  establecimientoId: number;
  descripcion: string;
  // selected: boolean;
}
