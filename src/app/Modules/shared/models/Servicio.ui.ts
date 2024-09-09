import { Precio } from '../../Core/models';
import { Servicio } from '../../Core/models/Servicio.model';
import { CatalogoUi } from './Catalogo.ui';
import { MultiviajeUI } from './Multiviaje.ui';
import { PlanUi } from './Plan.ui';
import { Cupon } from './data/Cupon';

export interface ServicioUi extends Servicio {
  catalogos: CatalogoUi[] | null;
  extras : PlanUi[] ;
  isSelected: boolean;
  costo : number | null;
  precios : Precio[];
  precioSelected : number | null;
  listcupones : Cupon[];
  cuponesCode : Cupon[];
  multiviajes : MultiviajeUI[];
}
