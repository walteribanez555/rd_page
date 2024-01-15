import { Catalogo, Plan } from "src/app/Modules/Core/models";

export interface TipoSiniestro {

  catalogo : Catalogo;
  planes : Plan[];
  isSelected : boolean;

}
