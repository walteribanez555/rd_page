import { Plan } from "src/app/Modules/Core/models/Plan.model";
import { BeneficioUi } from "../../models/Beneficio.ui";
import { Beneficio } from "src/app/Modules/Core/models/Beneficio.model";

export function mapToBeneficio(
  beneficio: Beneficio,
  ...planes: Plan[]
): BeneficioUi {
  return {
    plan: planes.filter(
      (plan) => plan.beneficio_id === beneficio.beneficio_id
    ),
    ...beneficio,
  };
}
