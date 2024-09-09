import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';



declare global {
  interface Window {
    Stripe?: any;
  }
}

@Component({
  selector: 'payment-stripe',
  templateUrl : './paymentStripe.component.html',
  styleUrls: ['./paymentStripe.component.css'],
})
export class PaymentStripeComponent {

  title = 'iplocation';

  country: string ="";

  @Input() amount! : number;
  @Input() clientSecret! : string;
  @Input() venta_id! : string;

  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);


  // private fb: FormBuilder,
  //             private cd: ChangeDetectorRef,
  //             private restService: RestService, private route: ActivatedRoute

  constructor() {
    this.STRIPE = window.Stripe(environment.stripe_public_key);
  }




  private readonly STRIPE!: any; //TODO: window.Stripe

  form: FormGroup = new FormGroup({})
  element : any;
  emailAddress = '';
  // @Output() closeModal = new EventEmitter();
  isChecking : boolean = false;
  private elementRef = inject(ElementRef);
  isReady =false;

  ngOnInit(): void {
    console.log("INICIEEEE");

    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1), Validators.max(100000)]],
      cardNumber: [false, [Validators.required, Validators.requiredTrue]], //TODO true | false
      cardCvv: [false, [Validators.required, Validators.requiredTrue]],//TODO true | false
      cardExp: [false, [Validators.required, Validators.requiredTrue]],//TODO true | false
      paymentelement: [false, [Validators.required, Validators.requiredTrue]],

    })

    // this.loadDetail();
    this.createStripeElement();
    // this.cd.detectChanges();
  }


  private createStripeElement = () => {
    this.form.patchValue({
      amount: parseFloat(this.amount.toFixed(2))
    })

    const appearance = {
      theme: 'stripe',
  variables: {
    fontWeightNormal: '500',
    borderRadius: '2px',
    colorPrimary: '#f360a6',
    tabIconSelectedColor: '#fff',
    gridRowSpacing: '16px'
  },
  rules: {
    '.Tab, .Input, .Block, .CheckboxInput, .CodeInput': {
      boxShadow: '0px 3px 10px rgba(18, 42, 66, 0.08)'
    },
    '.Block': {
      borderColor: 'transparent'
    },
    '.BlockDivider': {
      backgroundColor: '#ebebeb'
    },
    '.Tab, .Tab:hover, .Tab:focus': {
      border: '0'
    },
    '.Tab--selected, .Tab--selected:hover': {
      backgroundColor: '#f360a6',
      color: '#fff'
    }
  }

    };
    this.element =  this.STRIPE.elements({ appearance, clientSecret: this.clientSecret});

    const linkAuthenticationElement = this.element.create("linkAuthentication");
    linkAuthenticationElement.mount("#link-authentication-element");


    linkAuthenticationElement.on('change', (event : any) => {
      this.emailAddress = event.value.email;
    });

    const paymentElementOptions = {
      layout: "tabs",
    };

    const paymentElement = this.element.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");


  }

  async initPay(): Promise<any> {



  const { error } = await this.STRIPE.confirmPayment({
    elements : this.element,
    confirmParams: {
      return_url: `https://cotizaredcard.online/confirm-payment/?result=${this.venta_id}`,

    },
  });

  this.isChecking = false;


    if (error.type === "card_error" || error.type === "validation_error") {
      this.showMessage(error.message);
    } else {
      this.showMessage("An unexpected error occurred.");
    }

  }



  showMessage(messageText : string) {
    console.log(messageText);
  }





 }
