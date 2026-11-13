
/**
 * ICMS Price Conversion Engine
 *
 * Fórmula:
 * Preço novo = [ Preço atual × (1 - ICMS atual) ] / [ 1 - ICMS desejado ]
 *
 * Onde:
 * - Preço atual: preço de venda atual do produto (R$)
 * - ICMS atual: percentual de ICMS atual (ex.: 18% -> 0.18)
 * - ICMS desejado: percentual de ICMS desejado (ex.: 12% -> 0.12)
 *
 * Base sem ICMS:
 * Preço atual × (1 - ICMS atual)
 */

export interface IcmsCalculationResult {
  currentPrice: number;
  currentIcms: number;
  targetIcms: number;
  netPriceWithoutTax: number;
  currentTaxValue: number;
  targetPrice: number;
  targetTaxValue: number;
  differenceValue: number;
  differencePercent: number;
  divisor: number;
  formulaSteps: {
    numerator: number;
    denominator: number;
    description: string;
  };
}

export const COMMON_ICMS_RATES = [
  { rate: 0, label: '0% (Isento / Não tributado)' },
  { rate: 4, label: '4% (Interestadual Importados)' },
  { rate: 7, label: '7% (Interestadual N/NE/CO/ES)' },
  { rate: 12, label: '12% (Interestadual S/SE)' },
  { rate: 17, label: '17% (Interno Base AC/ES/MT/MS/SC/RS)' },
  { rate: 17.5, label: '17,5% (Interno RO)' },
  { rate: 18, label: '18% (Interno SP/MG/AP)' },
  { rate: 19, label: '19% (Interno PR/PA/AC/outros)' },
  { rate: 19.5, label: '19,5% (Interno c/ FECOP)' },
  { rate: 20, label: '20% (Interno RJ/AL/CE/RN/PB/RR/SE/TO)' },
  { rate: 20.5, label: '20,5% (Interno PE)' },
  { rate: 21, label: '21% (Interno BA/MA/PI)' },
  { rate: 22, label: '22% (Interno c/ adicional)' },
  { rate: 25, label: '25% (Alíquota especial / suntuosos)' },
];

export function calculateIcmsConversion(
  currentPrice: number,
  currentIcmsPercent: number,
  targetIcmsPercent: number
): IcmsCalculationResult {

  const pAtual = Math.max(0, currentPrice || 0);

  const icmsAtualDec =
    Math.max(0, Math.min(99.99, currentIcmsPercent || 0)) / 100;

  const icmsDesejadoDec =
    Math.max(0, Math.min(99.99, targetIcmsPercent || 0)) / 100;

  // Preço sem ICMS (Base líquida)
  const netPriceWithoutTax = pAtual * (1 - icmsAtualDec);

  // Valor do ICMS na origem
  const currentTaxValue = pAtual * icmsAtualDec;

  // Divisor: 1 - ICMS desejado
  const divisor = 1 - icmsDesejadoDec;

  // Preço novo
  const targetPrice =
    divisor > 0 ? netPriceWithoutTax / divisor : 0;

  // Valor do ICMS no destino
  const targetTaxValue = targetPrice * icmsDesejadoDec;

  // Diferença entre o preço novo e o atual
  const differenceValue = targetPrice - pAtual;

  // Diferença percentual
  const differencePercent =
    pAtual > 0 ? (differenceValue / pAtual) * 100 : 0;

  return {
    currentPrice: pAtual,
    currentIcms: currentIcmsPercent,
    targetIcms: targetIcmsPercent,
    netPriceWithoutTax,
    currentTaxValue,
    targetPrice,
    targetTaxValue,
    differenceValue,
    differencePercent,
    divisor,

    formulaSteps: {
      numerator: netPriceWithoutTax,
      denominator: divisor,
      description: `R$ ${pAtual.toFixed(2)} × (1 - ${icmsAtualDec.toFixed(2)}) ÷ (1 - ${icmsDesejadoDec.toFixed(2)})`,
    },
  };
}
