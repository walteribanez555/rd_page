import { Plan, Servicio } from "../../Core/models";
import { CatalogoUi } from "./Catalogo.ui";
import { PlanUi } from "./Plan.ui";

export interface ServicioUi extends Servicio{
  catalogos : CatalogoUi[] | null;
  isSelected: boolean;
}

