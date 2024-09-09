import { Catalogo } from "src/app/Modules/Core/models";
import { Plan } from "src/app/Modules/Core/models/Plan.model";

export interface TipoSiniestro {

  catalogo : Catalogo;
  planes : Plan[];
  isSelected : boolean;

}
