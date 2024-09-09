import { Beneficio } from "../../Core/models/Beneficio.model";
import { Plan } from "../../Core/models/Plan.model";

export interface BeneficioUi extends Beneficio {
  plan: Plan[];
}
