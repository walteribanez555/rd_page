
export interface Extra {
  cobertura:      number | null;
  moneda:         Moneda | null;
  complemento:    null | string;
  extra:          number;
  tipo_beneficio: number;
  beneficio:      string;
  incremento:     number;
  color:          Color | null;
  icono:          Icono | null;
}

export enum Color {
  The131313 = "#131313",
}

export enum Icono {
  ImgURL = "imgUrl",
  URLImg = "urlImg",
  Urlimg = "urlimg",
}

export enum Moneda {
  SUS = "Sus",
}
