import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number, currency: string = 'VND', locale: string = 'vi-VN'): string {
    // Kiểm tra giá trị null hoặc undefined
    if (value == null) {
      return '';
    }

    // Định dạng giá trị theo kiểu tiền tệ
    const formattedValue = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'code'
    }).format(value);

    // Xóa mã tiền tệ phía trước (ví dụ: 'VND') và thêm sau giá trị
    const amount = formattedValue.replace(currency, '').trim();
    return `${amount} ${currency}`;
  }
}
