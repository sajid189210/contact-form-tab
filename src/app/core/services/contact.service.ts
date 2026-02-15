import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IContact, ICreateContact } from '../models/contact.model';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/contacts`;

    // Signals for state management
    contacts = signal<IContact[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    constructor() {
        this.getAllContacts();
    }

    getAllContacts(): void {
        this.loading.set(true);
        this.http.get<IContact[]>(this.apiUrl).pipe(
            tap({
                next: (contacts) => {
                    this.contacts.set(contacts);
                    this.loading.set(false);
                    this.error.set(null);
                },
                error: (err) => {
                    this.error.set('Failed to load contacts');
                    this.loading.set(false);
                }
            })
        ).subscribe();
    }

    createContact(contact: ICreateContact): Observable<IContact> {
        this.loading.set(true);
        return this.http.post<IContact>(this.apiUrl, contact).pipe(
            tap({
                next: (newContact) => {
                    this.contacts.update(current => [...current, newContact]);
                    this.loading.set(false);
                    this.error.set(null);
                },
                error: (err) => {
                    this.error.set('Failed to create contact');
                    this.loading.set(false);
                }
            })
        );
    }

    updateContact(id: string, contact: ICreateContact): Observable<IContact> {
        this.loading.set(true);
        return this.http.put<IContact>(`${this.apiUrl}/${id}`, contact).pipe(
            tap({
                next: (updatedContact) => {
                    this.contacts.update(current => current.map(c => c.id === id ? updatedContact : c));
                    this.loading.set(false);
                    this.error.set(null);
                },
                error: (err) => {
                    this.error.set('Failed to update contact');
                    this.loading.set(false);
                }
            })
        );
    }

    deleteContact(id: string): Observable<void> {
        this.loading.set(true);
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap({
                next: () => {
                    this.contacts.update(current => current.filter(c => c.id !== id));
                    this.loading.set(false);
                    this.error.set(null);
                },
                error: (err) => {
                    this.error.set('Failed to delete contact');
                    this.loading.set(false);
                }
            })
        );
    }
}
