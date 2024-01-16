import { Beneficio, Plan } from "../../../../Modules/Core/models";
import { BeneficioUi } from "../../models/Beneficio.ui";

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
