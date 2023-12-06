export interface Plan {
  cobertura: number | null;
  moneda: Moneda | null;
  complemento: string;
  tipo_beneficio: number;
  beneficio: string;
  color: Color;
  icono: Icono;
}

export enum Color {
  The131313 = '#131313',
}

export enum Icono {
  ImgURL = 'imgUrl',
  URLImg = 'urlImg',
  Urlimg = 'urlimg',
}

export enum Moneda {
  SUS = 'Sus',
}
