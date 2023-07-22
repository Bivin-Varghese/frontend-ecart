import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  showPaypalStatus: boolean = false

  showSuccess: boolean = false

  public payPalConfig?: IPayPalConfig;

  discountClick: boolean = false

  offerClicked: boolean = false
  paymentStatus: boolean = false

  username: string = ''
  houseno: string = ''
  street: string = ''
  state: string = ''
  phoneno: string = ''



  totalprice = 0

  cartcount: string = ''

  allcart: any = []

  constructor(private api: ApiService, private checkOutFb: FormBuilder) { }


  checkOutForm = this.checkOutFb.group({
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]], // add space to add white space
    houseNumber: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9//s]*')]],
    street: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
    state: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    number: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  })



  ngOnInit(): void {

    this.initConfig();

    this.api.cartitemout.subscribe((data: any) => {
      // console.log(data);
      this.cartcount = data

    })

    this.api.getCart().subscribe((result: any) => {
      console.log(result);
      this.api.cartCount()
      this.allcart = result
      // alert(result)
      //cart total function
      this.getcartTotal()

    }, (result: any) => {
      console.log(result.error);

    }
    )
  }

  deleteCart(id: any) {
    return this.api.deleteCart(id).subscribe((result: any) => {
      this.allcart = result
      this.api.cartCount()
    },
      (result: any) => {
        alert(result.error)
      }
    )
  }

  // get cart total 
  getcartTotal() {
    let total = 0
    this.allcart.forEach((result: any) => {
      total += result.grandTotal
      this.totalprice = Math.ceil(total)
    })
  }


  //increment cart item
  incrementCart(id: any) {
    this.api.incrementCartCount(id).subscribe((result: any) => {
      this.allcart = result
      this.getcartTotal()
    },
      (result: any) => {
        alert(result.error)
      }
    )
  }


  //increment cart item
  decrementCart(id: any) {
    this.api.decrementCartCount(id).subscribe((result: any) => {
      this.allcart = result
      this.getcartTotal()
      this.api.cartCount()
    },
      (result: any) => {
        alert(result.error)
      }
    )
  }

  submitPay() {
    if (this.checkOutForm.valid) {
      this.username = this.checkOutForm.value.name || ''
      this.houseno = this.checkOutForm.value.houseNumber || ''
      this.street = this.checkOutForm.value.street || ''
      this.state = this.checkOutForm.value.state || ''
      this.phoneno = this.checkOutForm.value.number || ''

      this.paymentStatus = true
    }
    else {
      alert('invalid form')
    }
  }

  offerClick() {
    this.offerClicked = true
    this.discountClick = true
  }

  discount(value: any) {
    this.totalprice = this.totalprice * (100 - value) / 100
    this.offerClicked = false
  }


  // payment 

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  paypalPay() {
    this.showPaypalStatus = true
  }


  formReset() {
    this.checkOutForm.reset()
    this.showPaypalStatus = false
    this.showSuccess = false
    this.paymentStatus = false
  }

}



