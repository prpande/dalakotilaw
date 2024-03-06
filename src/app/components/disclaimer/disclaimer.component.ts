import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css']
})
export class DisclaimerComponent {
  title: string = "Disclaimer";

  disclaimers: string[] = [`The Bar Council of India does not permit advertisement or solicitation by advocates in any form or manner. 
  By accessing this website, www.dalakotilaw.com, you acknowledge and confirm that you are seeking information relating to Chamber of Aditi Dalakoti of your own accord 
  and that there has been no form of solicitation, advertisement or inducement by Chamber of Aditi Dalakoti or its members and associates.`,
  `The links provided on this website are to facilitate access to basic information on Chamber of Aditi Dalakoti and, it's members and associates. 
  The content herein or on such links should not be construed as a legal reference or legal advice. 
  Readers are advised not to act on any information contained herein or on the links and should refer to legal counsels and experts in their respective jurisdictions for further information and to determine its impact.`,
  `Careful attention has been given to ensure that the information provided herein is accurate and up-to-date. 
  However, Chamber of Aditi Dalakoti and, its members and associates are not responsible for any reliance that a reader places on such information and shall not be liable for any loss or damage caused due to any inaccuracy in or exclusion of any information, or its interpretation thereof. 
  Reader is advised to confirm the veracity of the same from independent and expert sources.`,
  `Chamber of Aditi Dalakoti advises against the use of the communication platform provided on this website for exchange of any confidential, business or politically sensitive information. 
  User is requested to use his or her judgment and exchange of any such information shall be solely at the user's risk.`,
  `The contents of this website are the intellectual property of Chamber of Aditi Dalakoti.`];

  accepted = false;

  constructor(public dialogRef: MatDialogRef<DisclaimerComponent>) {
    dialogRef.disableClose = true;
  }

  onAccept(){
    this.dialogRef.close(true);
  }

  onDecline(){
    window.location.href='https://www.google.com/';
  }
}
