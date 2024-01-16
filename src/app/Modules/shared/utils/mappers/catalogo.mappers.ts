import { Catalogo } from "src/app/Modules/Core/models/Catalogo.model";
import { BeneficioUi } from "../../models/Beneficio.ui";
import { CatalogoUi } from "../../models/Catalogo.ui";

export function mapBeneficiosToCatalogo(
  catalogo: Catalogo,
  beneficios: BeneficioUi[]
): CatalogoUi {
  return {
    ...catalogo,
    beneficios: beneficios.filter(
      (beneficio) => beneficio.tipo_beneficio === catalogo.valor
    ),
  };
}
