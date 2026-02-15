import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneMask',
    standalone: true
})
export class PhoneMaskPipe implements PipeTransform {

    transform(value: string | number): string {
        if (!value) {
            return '';
        }

        let phone = value.toString().replace(/\D/g, '');

        if (phone.length === 0) {
            return '';
        }

        if (phone.length > 10) {
            phone = phone.substring(0, 10);
        }

        if (phone.length < 10) {
            return phone;
        }


        const areaCode = phone.substring(0, 3);
        const middle = phone.substring(3, 6);
        const last = phone.substring(6, 10);

        return `(${areaCode}) ${middle}-${last}`;
    }

}
