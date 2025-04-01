import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Poliza } from 'src/app/Modules/Core/models';
import { VentaResp } from 'src/app/Modules/Core/models/Venta.model';
import { VentasService } from 'src/app/Modules/Core/services';
import { countries } from 'src/app/Modules/shared/utils/data/countries';
import { states_city } from 'src/app/Modules/shared/utils/data/states';




@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() onChangePage = new EventEmitter();
  @Output() onBackStep = new EventEmitter();

  private sanitizer = inject(DomSanitizer);
  private ventaService = inject(VentasService);

  isReadyPayment: boolean = false;

  checkoutForm?: FormGroup;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes Detected');
    this.cdr.detectChanges();
  }

  private elRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);

  @Input() proccessForms!: FormGroup[];
  @Input() onPageChanged?: Observable<any>;
  createIntentPayment: string | null = null;
  venta_id: number | null = null;
  client_secret : string | null = null;
  polizas_id: string = '';
  TypePayment = 2;
  stringReturnData = "";

  ngAfterViewInit(): void {
    this.onPageChanged?.subscribe({
      complete: () => {
        const selectCountryElement =
          this.elRef.nativeElement.querySelector('#country-select');
        const selectEstado =
          this.elRef.nativeElement.querySelector('#select-estado');

        const formElement = this.elRef.nativeElement.querySelector('#ID-FORM');

        this.cdr.detectChanges();

        this.renderer.listen(selectCountryElement, 'change', (event) => {
          const selectedIndex = selectCountryElement.selectedIndex;
          const codeCountry: string =
            selectCountryElement.options[selectedIndex].value;

          selectEstado.innerHTML = '';

          states_city.forEach((state_city: any) => {
            if (state_city.country_code == codeCountry) {
              const option = document.createElement('option');
              option.value = state_city['State Description']; // Set option value to country code
              option.text = state_city['State Description']; // Set option text to country name
              selectEstado.appendChild(option);
            }
          });

          this.cdr.detectChanges();
        });

        if (formElement) {
          this.renderer.listen(formElement, 'submit', (event) => {
            this.cdr.detectChanges();

            console.log(formElement);
            console.log(event);

            this.isReadyPayment = true;
            this.cdr.detectChanges();
          });
        }
      },
    });
  }

  getPaymentIntentReady() {
    return this.isReadyPayment;
  }

  ngOnInit(): void {
    this.onPageChanged?.subscribe({
      error: (err) => {},
      complete: () => {
        this.createIntentPayment = (
          this.proccessForms[7].value.ventRespData as VentaResp[]
        )
          .map((venta) => venta.venta_id ?? venta.id!)
          .join(',');
        this.payment_amount = (
          this.proccessForms[7].value.ventRespData as VentaResp[]
        ).reduce((prev, actual) => prev + actual.total_pago, 0);
        this.polizas_id = (
          this.proccessForms[8].value.polizaRespForm as Poliza[]
        )
          .map((poliza) => poliza.poliza_id ?? poliza.id)
          .join(',');

        const countryUbi = localStorage.getItem('country');

        // if (countryUbi === 'BO') {
        //   this.TypePayment = 1;
        //   this.htmlContent = this.createInjectPaymentForm();
        //   this.cdr.detectChanges();

        //   return;
        // }



        this.ventaService.createIntentPaymentStripe(this.payment_amount, this.polizas_id).subscribe({
          next : ( resp : any) => {

            console.log({resp});

            this.stringReturnData = `${this.createIntentPayment}-${this.polizas_id}`;

            this.client_secret = resp.data;

            this.cdr.detectChanges();


          },
          error : ( err ) => {

          },
          complete : () => {

          }
        })










        this.cdr.detectChanges();

        // console.log({ process: this.proccessForms });
      },
    });
  }

  citiesMappedToForm = states_city.map(
    (city_state: any) =>
      `<option value=${city_state['State Description']}>${city_state['State Description']}</option>`
  );

  countriesMappedToForm = countries.map(
    (country) => `<option value="${country['Code']}">${country.Name}</option>`
  );

  countrySelectInput = `<select name="pais" required id="country-select" > `;

  createInjectPaymentForm() {
    return this.sanitizer
      .bypassSecurityTrustHtml(`<form target="payments"   action="https://www.livees.net/Checkout/api4" method="POST" id="ID-FORM">
                                  <input type="hidden" name="_"    value="ad4zo3ujsigat6q0ckre1pyf62wbc263dmax576h5l8edcvn9">
                                  <input type="hidden" name="__" value="n3awy8gobm5cxdvtd40r0f6e94c6i9s7bjl12ua9kq3p6zdh1">
                                  <input type="hidden" name="postURL" value="https://cotizaredcard.online/confirm-payment">
                                  <input type="hidden" name="amt2" value="${this.payment_amount}">
                                  <input type="hidden" name="currency" value="USD">
                                  <input type="hidden" name="invno" value="${this.createIntentPayment}-${this.polizas_id}">
                                  <select name="pais" required id="country-select" >
                                      ${this.countriesMappedToForm}
                                  </select>
                                  <input type="text" name="name" value="" required placeholder="Nombres">
                                  <input type="text" name="lastname" required value="" placeholder="Apellidos">
                                  <input type="email" name="email" required value="" placeholder="redcard@gmail.com">

                                  <input type="text" required name="ciudad" value="Estado/Departament/Provincia">
                                  <select name="estado_lbl" required id="select-estado" >

                                  </select>
                                  <input type="text" name="dirección"  required value="" placeholder="direccion">
                                  <input type="text" name="zip" required value="" placeholder="zip">
                                  <input type="tel" name="phone" required value="" placeholder="77777777">
                                  <input type="hidden" required name="param2" value='[{"id":"1","name":"polizas","price":"${this.payment_amount}","quantity":"1"}]'>
                                  <input type="submit" value="Confirmar Detalles">
                                </form>


  `);
  }

  payment_amount = 0;

  htmlContent: SafeHtml | null = null;

  paymentFragment = this.sanitizer
    .bypassSecurityTrustHtml(`<iframe id="payments" name="payments"     >
  </iframe>`);

  onChangeStep() {
    this.onChangePage.emit();
  }

  onBackStepBtn() {
    this.onBackStep.emit();
  }
}
