/**
 * Brazilian Real currency & numerical formatters
 */

export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumberBr(value: number, decimals = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0,00';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatFactor(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '1,0000';
  return value.toFixed(4).replace('.', ',');
}

export function parseBrazilianNumber(input: string): number {
  if (!input) return 0;
  // Remove non-numeric characters except comma and dot
  const clean = input
    .replace(/[R$\s]/g, '')
    .trim();

  // If input contains both dot and comma (e.g. 1.250,50)
  if (clean.includes('.') && clean.includes(',')) {
    const standardized = clean.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(standardized);
    return isNaN(num) ? 0 : num;
  }

  // If input contains only comma (e.g. 55,50)
  if (clean.includes(',')) {
    const num = parseFloat(clean.replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }

  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}
