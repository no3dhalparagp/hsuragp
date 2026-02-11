// Convert numbers to words
// This is a utility function for converting numeric amounts to their word equivalents

const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
];

const teens = [
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

const scales = ['', 'Thousand', 'Lakh', 'Crore'];

function convertGroupToWords(num: number): string {
  if (num === 0) return '';

  let result = '';

  const hundreds = Math.floor(num / 100);
  if (hundreds > 0) {
    result += ones[hundreds] + ' Hundred ';
  }

  const remainder = num % 100;
  if (remainder >= 10 && remainder < 20) {
    result += teens[remainder - 10];
  } else {
    const tenDigit = Math.floor(remainder / 10);
    const oneDigit = remainder % 10;

    if (tenDigit > 0) {
      result += tens[tenDigit];
    }

    if (oneDigit > 0) {
      if (tenDigit > 0) result += ' ';
      result += ones[oneDigit];
    }
  }

  return result.trim();
}

export function convertToWords(num: number | string): string {
  let number = typeof num === 'string' ? parseInt(num, 10) : num;

  if (number === 0) return 'Zero';
  if (isNaN(number)) return '';

  if (number < 0) {
    return 'Minus ' + convertToWords(-number);
  }

  let result = '';
  let scaleIndex = 0;

  while (number > 0) {
    if (number % 1000 !== 0) {
      const groupWords = convertGroupToWords(number % 1000);
      if (groupWords) {
        result =
          groupWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (result ? ' ' + result : '');
      }
    }
    number = Math.floor(number / 1000);
    scaleIndex++;
  }

  return result.trim();
}
