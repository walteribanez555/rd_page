import { Catalogo, Beneficio, Precio } from "src/app/Modules/Core/models";
import { Extra } from "src/app/Modules/Core/models/Extra.model";
import { ServByPlan } from "src/app/Modules/Landing-page/Components/multi-step/multi-step.component";
import { MultiviajeUI } from "../../models/Multiviaje.ui";
import { PlanUi } from "../../models/Plan.ui";
import { ServicioUi } from "../../models/Servicio.ui";
import { Cupon } from "../../models/data/Cupon";
import { CuponValidator } from "../validators/Cupon.validator";
import { mapBeneficiosToCatalogo } from "./catalogo.mappers";
import { mapToBeneficio } from "./plan.mappers";


export function MapToServicioUi(
  catalogos: Catalogo[],
  beneficios: Beneficio[],
  extras: Extra[],
  servPlan: ServByPlan,
  precios: Precio[],
  cupones: Cupon[],
  multiviajes: Catalogo[],
  origen : string  = "PE",
): ServicioUi {
  // const beneficiosFiltered = beneficios.map((beneficio) =>
  //  {
  //     if(!servPlan.planes[0].extra){
  //       return mapToBeneficio(beneficio, ...servPlan.planes)
  //     }
  //     return null;

  //   }
  // ).filter( beneficio => beneficio);
  const beneficiosFiltered = beneficios
    .filter((beneficio) => servPlan.planes[0].extra === 0)
    .map((beneficio) => mapToBeneficio(beneficio, ...servPlan.planes));
  // const beneficiosExtraFiltered = beneficios.map((beneficio) => {
  //   if(servPlan.planes[0].extra){
  //     return mapExtraToServicio(extras, ...servPlan.planes);
  //   }
  // })
  // const beneficiosExtraFiltered = beneficios.filter((extra) => servPlan.planes[0].extra === 1 ).map(beneficio => mapToBeneficio(beneficio,...servPlan.planes));

  const planes_Extra: PlanUi[] = servPlan.planes
    .filter((plan) => plan.extra === 1)
    .map((plan) => {
      return {
        ...plan,
        isSelected: false,
        costo: null,
        extra_: extras.filter(
          (extra) => extra.beneficio_id === plan.beneficio_id
        )[0],
      };
    });

  const catalogosFiltered = catalogos.map((catalogo) =>
    mapBeneficiosToCatalogo(catalogo, beneficiosFiltered)
  );

  const preciosFiltered = precios.filter(
    (precio) => precio.servicio_id === servPlan.servicio.servicio_id
  );
  const cuponesFiltered = cupones.filter(
    (cupon) =>
      cupon.servicio_id === servPlan.servicio.servicio_id &&
      CuponValidator.validDate(cupon) &&
      CuponValidator.isUrlValidCupon(cupon, origen) &&
      !CuponValidator.isCodeCupon(cupon)
  );

  const cuponesWithCode = cupones.filter(
    (cupon) =>
      cupon.servicio_id === servPlan.servicio.servicio_id &&
      CuponValidator.validDate(cupon) &&
      CuponValidator.isCodeCupon(cupon)
  );

  console.log({cuponesWithCode});


  const multiviajesFiltered: MultiviajeUI[] = multiviajes
    .filter((multiviaje) => multiviaje.nivel === servPlan.servicio.servicio_id)
    .map((multiviaje) => {
      return { catalogo: multiviaje, isSelected: false };
    });

  return {
    catalogos: catalogosFiltered,
    ...servPlan.servicio,
    isSelected: false,
    extras: planes_Extra,
    costo: null,
    precios: preciosFiltered,
    precioSelected: null,
    listcupones: cuponesFiltered,
    multiviajes: multiviajesFiltered,
    cuponesCode : cuponesWithCode
    // extras : beneficiosExtraFiltered,
  };
}
