import { Extra, Plan } from '../../Core/models';

export interface PlanUi extends Plan {
  isSelected : boolean;
  costo : number  | null;
  extra_  : Extra,
}
