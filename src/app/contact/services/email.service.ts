import { Injectable } from '@angular/core';
declare let Email: any;
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }
  sendTestEmail() {
    Email.send({
      Host : "smtp.elasticemail.com",
      Username : "dalakoti.aditi@outlook.com",
      Password : "0FA5E198CE93419297ADED1F2624E8257A15",
      To : 'pratyush.pande@gmail.com',
      From : "dalakoti.aditi@outlook.com",
      Subject : "This is the subject",
      Body : "And this is the body"
  }).then(
    (message: any) => console.log(message)
  );
  }
}
