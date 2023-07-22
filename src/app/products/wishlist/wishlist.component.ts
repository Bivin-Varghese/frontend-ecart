import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  allwishlist: any = []

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getwishlist().subscribe((result: any) => {
      console.log(result);
      this.allwishlist = result
    },
      (result: any) => {
        console.log(result.error);
      }
    )
  }

  // delete wishlsit 
  deletewishlist(id: any) {
    return this.api.deletewishlist(id).subscribe((result) => {
      console.log(result);  //remaining wishlist products
      this.allwishlist = result
    })
  }



  // add to cart from wishlist 
  addtocart(product: any) {

    Object.assign(product, { quantity: 1 })


    this.api.addtocart(product).subscribe((result: any) => {
      this.api.cartCount()
      this.deletewishlist(product.id)
      alert(result)
    },
      (result: any) => {
        alert(result.error)
      }
    )

  }



}
