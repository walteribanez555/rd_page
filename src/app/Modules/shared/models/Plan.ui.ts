import { Extra } from "../../Core/models/Extra.model";
import { Plan } from "../../Core/models/Plan.model";

export interface PlanUi extends Plan {
  isSelected : boolean;
  costo : number  | null;
  extra_ : Extra;
}
