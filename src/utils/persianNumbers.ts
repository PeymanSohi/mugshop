// Persian number conversion utility
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Convert English digits to Persian digits
 */
export const toPersianNumbers = (text: string | number): string => {
  if (typeof text === 'number') {
    text = text.toString();
  }
  
  return text.replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
};

/**
 * Convert Persian digits to English digits
 */
export const toEnglishNumbers = (text: string): string => {
  return text.replace(/[۰-۹]/g, (digit) => {
    const index = persianDigits.indexOf(digit);
    return index !== -1 ? index.toString() : digit;
  });
};

/**
 * Format currency with Persian numbers
 */
export const formatPersianCurrency = (amount: number, currency: string = 'تومان'): string => {
  const formattedAmount = amount.toFixed(2);
  return `${toPersianNumbers(formattedAmount)} ${currency}`;
};

/**
 * Format number with Persian digits and thousand separators
 */
export const formatPersianNumber = (num: number, decimals: number = 0): string => {
  const formatted = num.toLocaleString('fa-IR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return formatted;
};

/**
 * Format price with Persian numbers and thousand separators
 */
export const formatPersianPrice = (price: number): string => {
  const formatted = price.toLocaleString('fa-IR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${formatted} تومان`;
};

/**
 * Convert quantity to Persian numbers
 */
export const formatPersianQuantity = (quantity: number): string => {
  return toPersianNumbers(quantity.toString());
};

/**
 * Format percentage with Persian numbers
 */
export const formatPersianPercentage = (percentage: number): string => {
  return `${toPersianNumbers(percentage.toString())}٪`;
};
