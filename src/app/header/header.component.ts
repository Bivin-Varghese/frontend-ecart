import { Component, OnInit } from '@angular/core';
import { ApiService } from '../products/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartcount:any='F'

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.cartitemout.subscribe((data: any) => {
      // console.log(data);
      this.cartcount = data

    })
  }

  search(event: any) {
    console.log(event.target.value); // value enterd by client
    this.api.searchTerm.next(event.target.value)
    // to  assign new value to behaviour subject use next() method
  }
}
