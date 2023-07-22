import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {

  productId: any
  product: any = {}

  constructor(private viewActivatedRoute: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
    this.viewActivatedRoute.params.subscribe((data: any) => {
      // console.log(data); Id:6
      console.log(data.id);
      this.productId = data.id


      //view particular product details
      this.api.viewproduct(this.productId).subscribe((result: any) => {
        console.log(result);
        this.product = result

      })

    })
  }


  //addtowishlist
  addtowishlist() {
    const { id, title, price, image } = this.product

    // api call 
    this.api.addtowishlist(id, title, price, image).subscribe((result) => {
      alert(result)
    },
      (result: any) => {
        alert(result.error)
      })
  }

  //add to cart
  addtocart(product: any) {
    // add quantity 1 to product object
    Object.assign(product, { quantity: 1 })
    console.log(product);

    this.api.addtocart(product).subscribe((result:any) => {
      this.api.cartCount()
      alert(result)
    },
      (result: any) => {
        alert(result.error)
      }
    )
  }

}
