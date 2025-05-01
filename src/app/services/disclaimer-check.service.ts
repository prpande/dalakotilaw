import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisclaimerCheckService {

  private showedDisclaimer = false;
  constructor() { }

  ShowDisclaimer() {
    this.showedDisclaimer = true;
  }

  get DidShowDisclaimer() {
    return this.showedDisclaimer;
  }
}
