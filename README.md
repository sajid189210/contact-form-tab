# Contact Form Tab Component (Angular)

## 📌 Project Overview

This project is a **custom contact form tab component** built using **Angular Reactive Forms**.  
It allows users to create multiple contacts, view them dynamically, and delete any contact.  
All data is handled **client-side** with no backend dependency.

The implementation focuses on:
- Clean reactive form handling
- Proper form validation
- US phone number masking
- Dynamic contact management

---

## ✨ Features

- Create multiple contacts
- Delete any contact
- Reactive form implementation
- Required field validation
- Email format validation
- US phone number masking `(123) 111-2222`
- Dynamic UI updates
- No backend required

---

## 🧱 Tech Stack

- **Angular**
- **TypeScript**
- **Reactive Forms**
- **Third-party phone mask library** (e.g., `ngx-mask`)
- HTML & CSS

---

## 📋 Contact Fields

Each contact contains the following fields:

| Field Name   | Required | Validation |
|-------------|----------|------------|
| First Name  | Yes      | Required |
| Last Name   | Yes      | Required |
| Email       | Yes      | Required, Email format |
| Phone       | Yes      | Required, US phone mask |

---

## 📞 Phone Number Masking

The phone number input follows the **US format**:


Masking is implemented using a third-party Angular masking library.

---

## 📂 Output Format

The collected contact data is stored in-memory and structured as follows:

```json
{
  "contacts": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@yopmail.com",
      "phone": "(123) 111-2222"
    },
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@yopmail.com",
      "phone": "(123) 111-2222"
    }
  ]
}
