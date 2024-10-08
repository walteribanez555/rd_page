// Generated by https://quicktype.io

export interface Poliza {
  poliza_id:          number|null;
  id : number|null;
  venta_id:           number;
  servicio_id:        number;
  destino:            string;
  fecha_salida:       string;
  fecha_retorno:      string;
  fecha_caducidad:    string;
  multiviaje:         number;
  nro_poliza:         null;
  nro_dias:           number;
  extra:              number;
  fecha_emision:      string;
  observaciones:      null | string;
  modificaciones:     number;
  fecha_modificacion: null | string;
  status:             number;
}



export interface PolizaToPost extends Omit<Poliza , 'poliza_id' | 'id' | 'nro_poliza' | 'nro_dias' | 'fecha_emision'|'modificaciones'| 'fecha_modificacion'| 'observaciones' > {
  username : string;

}
