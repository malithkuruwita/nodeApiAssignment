import { Component, OnInit } from '@angular/core';
import { DealService } from '../Shared/deal.service';
@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {

  events = []

  constructor(private _dealService: DealService) { }

  ngOnInit() {
    this._dealService.getEvents().subscribe(
      res => this.events = res,
      err => console.log(err) 
    )
  }


}
