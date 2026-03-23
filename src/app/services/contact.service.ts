import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Web3FormsResponse { success: boolean; message: string; }

@Injectable({ providedIn: 'root' })
export class ContactService {
  private endpoint = 'https://api.web3forms.com/submit';
  constructor(private http: HttpClient) {}
  submitForm(data: { name: string; email: string; phone?: string; subject: string; message: string }): Observable<Web3FormsResponse> {
    return this.http.post<Web3FormsResponse>(this.endpoint, { access_key: environment.web3formsAccessKey, ...data });
  }
}
