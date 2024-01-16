import { Beneficio, Plan } from '../../Core/models';

export interface BeneficioUi extends Beneficio {
  plan: Plan[];
}
