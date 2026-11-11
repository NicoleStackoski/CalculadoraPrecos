/**
 * Circular Normativa nº 156.023
 * FATOR DE MULTIPLICAÇÃO PARA CÁLCULO DE PREÇO DE VENDA EM REAL
 * Taxa diária de juros: 0,0496%
 * Taxa mensal de juros: 1,50%
 * Eliane S/A - Revestimentos Cerâmicos (Mohawk Brasil)
 */

export interface DayFactor {
  days: number;
  factor: number;
  tag?: 'IDEAL' | 'BOM' | 'MÁXIMO' | 'ESPECIAL';
}

export const CIRCULAR_METADATA = {
  number: '156.023',
  date: '04/07/2023',
  substitutes: '205.019',
  dailyInterestRate: 0.0496, // 0,0496%
  monthlyInterestRate: 1.5, // 1,50%
  issuer: 'Rogério Longoni de Souza - Diretor Comercial',
  company: 'Eliane S/A Revestimentos Cerâmicos / Mohawk Brasil',
};

// Exact table from Circular 156.023 (1 to 120 days)
export const FATORES_CIRCULAR_156: Record<number, number> = {
  0: 1.0000, // À vista
  1: 1.0005,
  2: 1.0010,
  3: 1.0015,
  4: 1.0020,
  5: 1.0025,
  6: 1.0030,
  7: 1.0035,
  8: 1.0040,
  9: 1.0045,
  10: 1.0050,
  11: 1.0055,
  12: 1.0060,
  13: 1.0065,
  14: 1.0070,
  15: 1.0075,
  16: 1.0080,
  17: 1.0085,
  18: 1.0090,
  19: 1.0095,
  20: 1.0100,
  21: 1.0105,
  22: 1.0110,
  23: 1.0115,
  24: 1.0120,
  25: 1.0125,
  26: 1.0130,
  27: 1.0135,
  28: 1.0140, // IDEAL
  29: 1.0145,
  30: 1.0150,
  31: 1.0155,
  32: 1.0160,
  33: 1.0165,
  34: 1.0170,
  35: 1.0175,
  36: 1.0180,
  37: 1.0185,
  38: 1.0190,
  39: 1.0195,
  40: 1.0200,
  41: 1.0206,
  42: 1.0211, // BOM
  43: 1.0216,
  44: 1.0221,
  45: 1.0226,
  46: 1.0231,
  47: 1.0236,
  48: 1.0241,
  49: 1.0246,
  50: 1.0251,
  51: 1.0256,
  52: 1.0261,
  53: 1.0267,
  54: 1.0272,
  55: 1.0277,
  56: 1.0282, // MÁXIMO
  57: 1.0287,
  58: 1.0292,
  59: 1.0297,
  60: 1.0302,
  61: 1.0307,
  62: 1.0312,
  63: 1.0318,
  64: 1.0323,
  65: 1.0328,
  66: 1.0333,
  67: 1.0338,
  68: 1.0343,
  69: 1.0348,
  70: 1.0354,
  71: 1.0359,
  72: 1.0364,
  73: 1.0369,
  74: 1.0374,
  75: 1.0379,
  76: 1.0384,
  77: 1.0390,
  78: 1.0395,
  79: 1.0400,
  80: 1.0405,
  81: 1.0410,
  82: 1.0415,
  83: 1.0421,
  84: 1.0426,
  85: 1.0431,
  86: 1.0436,
  87: 1.0441,
  88: 1.0446,
  89: 1.0452,
  90: 1.0457,
  91: 1.0462,
  92: 1.0467,
  93: 1.0472,
  94: 1.0478,
  95: 1.0483,
  96: 1.0488,
  97: 1.0493,
  98: 1.0498,
  99: 1.0504,
  100: 1.0509,
  101: 1.0514,
  102: 1.0519,
  103: 1.0524,
  104: 1.0530,
  105: 1.0535,
  106: 1.0540,
  107: 1.0545,
  108: 1.0551,
  109: 1.0556,
  110: 1.0561,
  111: 1.0566,
  112: 1.0572,
  113: 1.0577,
  114: 1.0582,
  115: 1.0587,
  116: 1.0593,
  117: 1.0598,
  118: 1.0603,
  119: 1.0608,
  120: 1.0614,
};

export const LISTA_FATORES: DayFactor[] = Array.from({ length: 120 }, (_, i) => {
  const days = i + 1;
  let tag: DayFactor['tag'];
  if (days === 28) tag = 'IDEAL';
  else if (days === 42) tag = 'BOM';
  else if (days === 56) tag = 'MÁXIMO';
  else if (days === 90) tag = 'ESPECIAL';

  return {
    days,
    factor: FATORES_CIRCULAR_156[days] || 1.0,
    tag,
  };
});

function clampDays(days: number): number {
  if (!Number.isFinite(days)) return 0;
  return Math.min(120, Math.max(0, Math.round(days)));
}

/**
 * Returns financial factor for given days. Strictly capped between 0 and 120 days.
 */
export function getFactorForDays(days: number): number {
  const clamped = clampDays(days);
  if (clamped === 0) return 1.0;
  return FATORES_CIRCULAR_156[clamped] ?? 1.0614;
}

/**
 * Calculates average term (prazo médio) given initial date, interval, and number of installments.
 */
export function calculateAverageTerm(
  startDays: number,
  intervalDays: number,
  installmentsCount: number
): {
  averageDays: number;
  installments: number[];
} {
  const count = Math.max(1, installmentsCount || 1);
  const start = Math.max(0, startDays || 0);
  const interval = Math.max(0, intervalDays || 0);

  const installments: number[] = [];
  let sum = 0;

  for (let i = 0; i < count; i++) {
    const day = start + i * interval;
    installments.push(day);
    sum += day;
  }

  const averageDays = Math.round(sum / count);
  return {
    averageDays,
    installments,
  };
}

/**
 * Calculates cascading discounts (desconto sucessivo em cascata):
 * Preço_liquido = Preço * (1 - d1) * (1 - d2) * ...
 */
export function calculateCascadingDiscounts(
  price: number,
  discounts: number[]
): {
  discountedPrice: number;
  totalDiscountPercent: number;
  totalDiscountValue: number;
} {
  if (price <= 0) {
    return { discountedPrice: 0, totalDiscountPercent: 0, totalDiscountValue: 0 };
  }

  let multiplier = 1.0;
  for (const d of discounts) {
    if (d > 0) {
      multiplier *= (1 - Math.min(100, Math.max(0, d)) / 100);
    }
  }

  const discountedPrice = price * multiplier;
  const totalDiscountPercent = (1 - multiplier) * 100;
  const totalDiscountValue = price - discountedPrice;

  return {
    discountedPrice,
    totalDiscountPercent,
    totalDiscountValue,
  };
}

/**
 * Deflates price from base term and inflates to target term:
 * 1. Base Price (or after cascade discount) / Base Factor = Cash Price (À Vista)
 * 2. Cash Price * Target Factor = Target Price (No Prazo Alvo)
 */
export function calculateTermConversion(
  listPrice: number,
  baseDays: number,
  targetDays: number,
  discounts: number[] = []
): {
  originalPrice: number;
  priceAfterDiscounts: number;
  cashPrice: number;
  targetPrice: number;
  baseDays: number;
  baseFactor: number;
  targetDays: number;
  targetFactor: number;
  differenceToOriginal: number;
  percentChangeToOriginal: number;
  totalDiscountPercent: number;
  effectiveDeflationFactor: number;
} {
  const { discountedPrice, totalDiscountPercent } = calculateCascadingDiscounts(listPrice, discounts);
  const effectivePrice = discounts.some((d) => d > 0) ? discountedPrice : listPrice;

  const bDays = clampDays(baseDays);
  const tDays = clampDays(targetDays);

  const baseFactor = getFactorForDays(bDays);
  const targetFactor = getFactorForDays(tDays);

  // À vista = Preço / Fator Base
  const cashPrice = baseFactor > 0 ? effectivePrice / baseFactor : effectivePrice;

  // No Prazo = À vista * Fator Alvo
  const targetPrice = cashPrice * targetFactor;

  const differenceToOriginal = targetPrice - listPrice;
  const percentChangeToOriginal = listPrice > 0 ? (differenceToOriginal / listPrice) * 100 : 0;
  const effectiveDeflationFactor = baseFactor > 0 ? targetFactor / baseFactor : 1;

  return {
    originalPrice: listPrice,
    priceAfterDiscounts: effectivePrice,
    cashPrice,
    targetPrice,
    baseDays: bDays,
    baseFactor,
    targetDays: tDays,
    targetFactor,
    differenceToOriginal,
    percentChangeToOriginal,
    totalDiscountPercent,
    effectiveDeflationFactor,
  };
}
