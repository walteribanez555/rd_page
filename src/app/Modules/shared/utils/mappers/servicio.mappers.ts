import {
  Beneficio,
  Catalogo,
  Plan,
  Servicio,
} from 'src/app/Modules/Core/models';
import { ServByPlan } from 'src/app/Modules/Landing-page/Components/multi-step/multi-step.component';
import { mapToBeneficio } from './plan.mappers';
import { mapBeneficiosToCatalogo } from './catalogo.mappers';
import { ServicioUi } from '../../models';

export function MapToServicioUi(
  catalogos: Catalogo[],
  beneficios: Beneficio[],
  servPlan: ServByPlan
): ServicioUi {
  const beneficiosFiltered = beneficios.map((beneficio) =>
    mapToBeneficio(beneficio, ...servPlan.planes)
  );
  const catalogosFiltered = catalogos.map((catalogo) =>
    mapBeneficiosToCatalogo(catalogo, beneficiosFiltered)
  );
  return {
    catalogos: catalogosFiltered,
    ...servPlan.servicio,
    isSelected: false,
  };
}
