import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PlanUi } from 'src/app/Modules/shared/models/Plan.ui';
import { ServicioUi } from 'src/app/Modules/shared/models/Servicio.ui';
import { VentaUi } from 'src/app/Modules/shared/models/Venta.ui';
import { Cupon } from 'src/app/Modules/shared/models/data/Cupon';
import { CountryRegion } from 'src/app/Modules/shared/utils/data/countries-region.ts/countries-region';
import { VentaMappers } from 'src/app/Modules/shared/utils/mappers/venta.mappers';

@Component({
  selector: 'detail',
  styleUrls: ['./detail.component.css'],
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
  ngOnInit(): void {
    this.onDetail?.subscribe({
      next: (step: number) => {
        if (step === 6) {
          this.mapData();
        }
      },
    });
  }

  @Input() forms!: FormGroup[];
  @Input() onDetail?: Observable<any>;

  @Output() onChangePage = new EventEmitter();
  @Output() onBackStep = new EventEmitter();

  destinyList: CountryRegion[] = [];
  origen?: CountryRegion;

  discountCode = '';

  selectedPlanesExtras: PlanUi[] = [];

  ventaMapper = new VentaMappers();

  totalPayment = 0;
  ventaUi: VentaUi | null = null;

  cuponesCode: Cupon[] = [];

  onChangeStep() {
    console.log(this.ventaUi);
    this.forms[5].get('ventaData')?.setValue(this.ventaUi);
    this.onChangePage.emit();
  }

  onBackStepBtn() {
    this.onBackStep.emit();
  }

  mapData() {
    this.origen = this.forms['0'].get('fromLocation')?.value as CountryRegion;
    this.destinyList = this.forms[0].get('toLocation')
      ?.value as CountryRegion[];
    this.selectedPlanesExtras = (
      this.forms[3].get('planSelected')?.value as ServicioUi
    ).extras.filter((extra) => extra.isSelected);
    this.selectedPlanesExtras.forEach((planExtra) => {
      planExtra.costo =
        (planExtra.incremento *
          (this.forms[3].get('planSelected')?.value as ServicioUi)
            .precioSelected!) /
        100;
    });

    const youngQuantity: number = this.forms[2].get('youngQuantity')?.value;
    const adultQuantity: number = this.forms[2].get('adultQuantity')?.value;
    const seniorQuantity: number = this.forms[2].get('seniorQuantity')?.value;

    console.log(this.forms);

    this.ventaUi = this.ventaMapper.mapVenta(
      this.forms[3].get('planSelected')?.value as ServicioUi,
      {
        adultQuantity,
        seniorQuantity,
        youngQuantity,
      },
      0,
      this.forms[1].get('quantityDays')?.value as number,
      this.forms['0'].get('fromLocation')?.value.iso2,
      this.forms['0'].get('toLocation')?.value
    );

    console.log(this.ventaUi);

    const totalExtras = this.selectedPlanesExtras.reduce(
      (accum, actualValue) => accum + actualValue.costo!,
      0
    );

    this.totalPayment =
      totalExtras +
      (this.forms[3].get('planSelected')?.value as ServicioUi).precioSelected!;
  }

  findDiscount() {
    // console.log(this.discountCode);

    if (this.ventaUi?.codigoDescuento) {
      this.ventaUi.totalPagoGrupal =
        this.ventaUi.totalPagoGrupal + this.ventaUi.codigoDescuento;
    }

    this.ventaUi!.codigoDescuento = null;

    const discounts = (this.forms[3].get('planSelected')?.value as ServicioUi)
      .cuponesCode!;

    const discountByCode = discounts.filter(
      (discount) => discount.nombre?.split('_')[1] == this.discountCode
    );
    this.cuponesCode = discountByCode;

    if (discountByCode.length > 0) {
      this.ventaUi!.codigoDescuento =
        discountByCode[0].tipo_valor === 1
          ? discountByCode[0].valor * (this.ventaUi!.totalPagoGrupal / 100)
          : discountByCode[0].valor;
      this.ventaUi!.totalPagoGrupal =
        this.ventaUi!.totalPagoGrupal - this.ventaUi!.codigoDescuento;
      // return;
    }

    console.log('No se encontro ningun cupon');
  }
}
