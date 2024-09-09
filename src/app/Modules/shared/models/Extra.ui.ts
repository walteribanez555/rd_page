import { Extra } from "../../Core/models/Extra.model";
import { Plan } from "../../Core/models/Plan.model";


export interface ExtraUi extends Extra {
  planUi : Plan[];
  isSelected : boolean;

}
