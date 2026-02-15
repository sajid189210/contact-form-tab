import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactService } from './core/services/contact.service';
import { ContactFormComponent } from './shared/components/contact-form/contact-form.component';
import { HeaderTabsComponent, ITab } from './shared/components/header-tabs/header-tabs.component';
import { IContact, ICreateContact } from './core/models/contact.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactFormComponent,
    HeaderTabsComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private contactService = inject(ContactService);

  // Public signals from service
  contacts = this.contactService.contacts;
  loading = this.contactService.loading;
  error = this.contactService.error;

  // Local state
  selectedContactId = signal<string | null>(null);

  // Derived state for tabs
  tabs = computed<ITab[]>(() => {
    const currentContacts = this.contacts();
    const selectedId = this.selectedContactId();

    return currentContacts.map((contact, index) => {
      const tabId = contact.id || String(index);
      return {
        label: `Contact ${index + 1}`,
        id: tabId,
        active: String(tabId) === String(selectedId)
      };
    });
  });

  // Derived state for form data
  selectedContactData = computed<IContact | null>(() => {
    const id = this.selectedContactId();
    if (!id) return null;

    return this.contacts().find((c, i) => {
      const contactId = c.id || String(i);
      return String(contactId) === String(id);
    }) || null;
  });

  onTabSelected(event: { index: number, tab: ITab }): void {
    // Ensure we store the ID as a string to match our computed logic
    this.selectedContactId.set(String(event.tab.id));
  }

  onAddNew(): void {
    this.selectedContactId.set(null);
  }

  onDeleteTab(tab: ITab): void {
    const id = String(tab.id);
    if (confirm(`Are you sure you want to delete ${tab.label}?`)) {
      this.contactService.deleteContact(id).subscribe(() => {
        if (this.selectedContactId() === id) {
          const remaining = this.contacts();
          if (remaining.length > 0) {
            this.selectedContactId.set(remaining[0].id || null);
          } else {
            this.selectedContactId.set(null);
          }
        }
      });
    }
  }

  onFormSubmit(data: ICreateContact): void {
    const selectedId = this.selectedContactId();

    if (selectedId) {
      // Update existing
      this.contactService.updateContact(selectedId, data).subscribe({
        next: (updatedContact) => {
          // Success handled by signal update in service
          console.log('Contact updated', updatedContact);
        },
        error: (err) => console.error(err)
      });
    } else {
      // Create new
      this.contactService.createContact(data).subscribe({
        next: (newContact) => {
          if (newContact.id) {
            this.selectedContactId.set(newContact.id);
          }
        },
        error: (err) => console.error(err)
      });
    }
  }
}
