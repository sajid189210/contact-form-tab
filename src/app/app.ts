import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

interface IContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface IHeadTabs {
  label: string;
  index: number;
  active: boolean;
}

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly _fb = inject(FormBuilder);

  protected title = 'Contact Form';
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  private phoneRegex = /^\d{10}$/;


  contactForm: FormGroup = this._fb.group({
    firstName: ['', [Validators.required]],
    lastName: [''],
    email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailRegex)]],
    phone: ['', [Validators.pattern(this.phoneRegex)]],
  });

  contacts: IContact[] = [];
  headTabs: IHeadTabs[] = [];

  selectedIndex: number = -1;

  get hasFirstNameError(): boolean {
    return this.contactForm.get('firstName')?.invalid && this.contactForm.get('firstName')?.touched || false;
  }

  get hasEmailError(): boolean {
    return this.contactForm.get('email')?.invalid && this.contactForm.get('email')?.touched || false;
  }

  get hasPhoneError(): boolean {
    const ctrl = this.contactForm.get('phone');
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  submitForm() {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) return;

    const contact: IContact = this.contactForm.value;

    if (this.selectedIndex >= 0) {
      this.contacts[this.selectedIndex] = contact;
      return;
    }

    this.contacts.push(contact);
    const newIndex = this.contacts.length - 1;
    this.selectedIndex = newIndex;

    this.headTabs = this.headTabs.map(t => ({ ...t, active: false }));
    this.headTabs.push({
      label: `Contact ${this.contacts.length}`,
      index: newIndex,
      active: true
    });

    this.contactForm.markAsPristine();
    this.contactForm.markAsUntouched();
  }

  selectTab(index: number): void {
    this.selectedIndex = index;

    this.headTabs = this.headTabs.map(tab => ({
      ...tab,
      active: tab.index === index
    }));

    this.contactForm.reset();
    this.contactForm.patchValue(this.contacts[index]);
  }

  newContact(): void {
    this.selectedIndex = -1;
    this.contactForm.reset();

    this.headTabs = this.headTabs.map(tab => ({
      ...tab,
      active: false
    }));
  }
}
