import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    return value
      .toLocaleLowerCase('pt-BR')
      .replace(/(^|[\s-])([\p{L}\p{M}])/gu, (_match, separator: string, letter: string) =>
        separator + letter.toLocaleUpperCase('pt-BR')
      );
  }
}
