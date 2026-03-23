import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisclaimerCheckService {

  private static readonly STORAGE_KEY = 'disclaimerAccepted';
  private static readonly TTL_MS = 30 * 60 * 1000; // 30 minutes

  constructor() { }

  ShowDisclaimer() {
    localStorage.setItem(DisclaimerCheckService.STORAGE_KEY, Date.now().toString());
  }

  get DidShowDisclaimer() {
    const timestamp = localStorage.getItem(DisclaimerCheckService.STORAGE_KEY);
    if (!timestamp) return false;
    return (Date.now() - Number(timestamp)) < DisclaimerCheckService.TTL_MS;
  }
}
