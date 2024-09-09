import { Cupon } from "../../models/data/Cupon";


export class CuponValidator{

  static validDate(cupon : Cupon){
    const actualDate = new Date();
    const initialDate = cupon.fecha_desde.split('T')[0];
    const finalDate = cupon.fecha_hasta.split('T')[0];

    return (actualDate >= new Date(initialDate) && actualDate <= new Date(finalDate)) ;
  }



  static isWithOriginOnStorage(){

  }


  static isUrlValidCupon(cupon :Cupon , origin = "BO") {
    const cuponDetails = cupon.nombre?.split('-');
    if(cuponDetails?.length === 1) {
      return true;
    }


    if(cuponDetails![1].length == 2) {
      if(origin.toUpperCase() == cuponDetails![1]){
        return true;
      }
    }


    if(cuponDetails![1] === window.location.hostname){
      return true;
    }

    return false;
  }

  static isCodeCupon( cupon :Cupon) {
    const cuponDetails = cupon.nombre?.split('_');
    if(cuponDetails!.length > 1){
      return true;
    }
    return false;
  }

  static isWithPolicie(cupon: Cupon, data: any) {
    if (!cupon.oficina_id) return 1;

    const policie = JSON.parse(cupon.oficina_id);

    if (
      policie.agelimit != undefined &&
      data.beneficiarAgeLimit != undefined &&
      policie.agelimit <= data.beneficiarAgeLimit &&
      policie.quantity != undefined &&
      policie.quantity == 1 &&
      policie.daysMin != undefined &&
      policie.daysMin >= data.days

    ) {
      console.log('Si es valido como unico y verdadero');
      return 2;
    }






    console.log({ policie, data });

    if (
      policie.quantity != undefined &&
      data.quantity != undefined &&
      policie.daysMin != undefined &&
      data.days != undefined &&
      (data.quantity % policie.quantity == 0 && policie.quantity != 1  ) &&
      policie.daysMin >= data.days
    ) {
      console.log('Si es valido como grupo y verdadero');
      return 3;
    }

    console.log("Sera falso");

    return 0;
  }

}
