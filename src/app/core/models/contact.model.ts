export interface IContact {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
}

export interface ICreateContact {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
}
