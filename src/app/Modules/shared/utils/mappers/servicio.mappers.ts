import { Beneficio } from "src/app/Modules/Core/models/Beneficio.model";
import { Catalogo } from "src/app/Modules/Core/models/Catalogo.model";
import { Cupon } from "src/app/Modules/Core/models/Cupon.model";
import { Extra } from "src/app/Modules/Core/models/Extra.model";
import { Precio } from "src/app/Modules/Core/models/Precio.model";
import { ServByPlan } from "src/app/Modules/Landing-page/Components/multi-step/multi-step.component";
import { ServicioUi } from "../../models/Servicio.ui";
import { mapToBeneficio } from "./plan.mappers";
import { PlanUi } from "../../models/Plan.ui";
import { mapBeneficiosToCatalogo } from "./catalogo.mappers";
import { CuponValidator } from "../validators/cupon.validator";


export function MapToServicioUi(
  catalogos: Catalogo[],
  beneficios: Beneficio[],
  extras : Extra[],
  servPlan: ServByPlan,
  precios : Precio[],
  cupones : Cupon[],
): ServicioUi {



  // const beneficiosFiltered = beneficios.map((beneficio) =>
  //  {
  //     if(!servPlan.planes[0].extra){
  //       return mapToBeneficio(beneficio, ...servPlan.planes)
  //     }
  //     return null;

  //   }
  // ).filter( beneficio => beneficio);
  const beneficiosFiltered = beneficios.filter((beneficio) => servPlan.planes[0].extra===0 ).map( beneficio => mapToBeneficio(beneficio,...servPlan.planes.filter( plan => plan.beneficio_id === beneficio.beneficio_id)));
  // const beneficiosExtraFiltered = beneficios.map((beneficio) => {
  //   if(servPlan.planes[0].extra){
  //     return mapExtraToServicio(extras, ...servPlan.planes);
  //   }
  // })
  // const beneficiosExtraFiltered = beneficios.filter((extra) => servPlan.planes[0].extra === 1 ).map(beneficio => mapToBeneficio(beneficio,...servPlan.planes));

  const planes_Extra : PlanUi[] = servPlan.planes.filter( plan => plan.extra===1).map(plan => {
    return {
      ...plan,
      isSelected: false,
      costo : null,
      extra_  : extras.filter(extra => extra.beneficio_id === plan.beneficio_id)[0]
    }
  });

  const catalogosFiltered = catalogos.map((catalogo) =>
    mapBeneficiosToCatalogo(catalogo, beneficiosFiltered)
  );

  const preciosFiltered = precios.filter(precio => precio.servicio_id === servPlan.servicio.servicio_id);
  const cuponesFiltered = cupones.filter(cupon => cupon.servicio_id === servPlan.servicio.servicio_id  && CuponValidator.validDate(cupon));

  return {
    catalogos: catalogosFiltered,
    ...servPlan.servicio,
    isSelected: false,
    extras : planes_Extra,
    costo : null,
    precios : preciosFiltered,
    precioSelected : null,
    listcupones : cuponesFiltered,
    // extras : beneficiosExtraFiltered,
  };
}
