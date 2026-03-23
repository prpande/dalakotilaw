import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  formState: 'idle' | 'submitting' | 'success' | 'error' = 'idle';

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) return;
    this.formState = 'submitting';
    this.contactService.submitForm(this.contactForm.value).subscribe({
      next: (response) => {
        this.formState = response.success ? 'success' : 'error';
        if (response.success) this.contactForm.reset();
      },
      error: () => { this.formState = 'error'; }
    });
  }

  resetForm(): void { this.formState = 'idle'; }
}
