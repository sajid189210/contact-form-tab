import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ICreateContact } from '../../../core/models/contact.model';
import { trimmedRequired } from '../../../core/validators/form-validators';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() initialData: ICreateContact | null = null;
  @Input() loading: boolean = false;
  @Output() formSubmit = new EventEmitter<ICreateContact>();

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  private phoneRegex = /^\d{10}$/; // Validates 10 raw digits (ngx-mask strips formatting)
  private nameRegex = /^[\p{L}][\p{L}'\- ]{1,49}$/u;

  contactForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, trimmedRequired, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(this.nameRegex)]],
    lastName: ['', [Validators.pattern(this.nameRegex)]],
    email: ['', [Validators.required, Validators.email, trimmedRequired, Validators.pattern(this.emailRegex)]],
    phone: ['', [Validators.pattern(this.phoneRegex)]],
  });

  ngOnInit(): void {
    if (this.initialData) {
      this.contactForm.patchValue(this.initialData);
    }
  }

  @Input() set data(value: ICreateContact | null) {
    if (value) {
      this.contactForm.patchValue(value);
    } else {
      this.contactForm.reset();
    }
  }

  hasError(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  submit(): void {
    if (this.contactForm.valid) {
      this.formSubmit.emit(this.contactForm.value);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  reset(): void {
    this.contactForm.reset();
  }
}
