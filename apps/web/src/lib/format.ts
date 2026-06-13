export function formatInr(amount: string | number, locale = 'en-IN'): string {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

export function parseAmountInput(value: string): number {
  return Math.round(Number(value.replace(/,/g, '')) || 0);
}
