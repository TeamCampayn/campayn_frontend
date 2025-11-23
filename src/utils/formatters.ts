// Utility function to format numbers with proper commas and abbreviations
export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  // Convert to absolute value for formatting
  const absValue = Math.abs(value);
  const isNegative = value < 0;
  const prefix = isNegative ? '-' : '';

  if (absValue >= 1_000_000_000) {
    return `${prefix}${(absValue / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    return `${prefix}${(absValue / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    return `${prefix}${(absValue / 1_000).toFixed(1)}K`;
  } else {
    return `${prefix}${absValue.toLocaleString()}`;
  }
};

// Utility function to format percentages
export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${value.toFixed(1)}%`;
};

// Utility function to format currency
export const formatCurrency = (value: number | null | undefined, currency: string = 'USD'): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(value);
};

// Utility function to format large numbers with full precision
export const formatFullNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString();
};