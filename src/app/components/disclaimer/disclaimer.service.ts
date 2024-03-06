import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DisclaimerComponent } from './disclaimer.component';

@Injectable({
  providedIn: 'root'
})
export class DisclaimerService {

  constructor(private disclaimerDialog: MatDialog) { }
  openDisclaimer(): Observable<boolean>{
    const dialogRef = this.disclaimerDialog.open(DisclaimerComponent, {width: '70vw', minWidth: '340px', maxWidth: '1000px', maxHeight: '80vh'});
    return dialogRef.afterClosed();
  }
}
