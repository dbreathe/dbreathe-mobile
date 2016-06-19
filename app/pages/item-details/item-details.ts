import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/item-details/item-details.html'
})
export class ItemDetailsPage {
  selectedItem: any;

  constructor(private nav: NavController, navParams: NavParams) {
    this.selectedItem = navParams.get('item');
  }
}
