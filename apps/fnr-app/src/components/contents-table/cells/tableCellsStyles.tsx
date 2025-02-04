import React from 'react';

// Shared styles and formatting utilities for table cell components, particularly focused on
// quote formatting with special handling for decimal places and consistent styling across cells
export const styles = {
  container: 'flex items-center justify-end w-full',
  inputField: 'w-24',
  priceContainer: 'text-right max-h-[52px]',
  eachPrice: 'text-muted-foreground text-sm',
  noQuote: 'text-muted-foreground italic',
  numberContainer: 'inline-flex items-start',
  decimals: 'text-[0.85em] pl-[3px] align-top mt-[-1px]',
} as const;

// Format a number to display decimals in smaller font with optional opacity for "00"
export const formatNumberWithSmallDecimals = (num: number) => {
  // For zero, return normal format with decimals
  if (num === 0) {
    return (
      <span className={styles.numberContainer}>
        0<span className={`${styles.decimals} opacity-60`}>00</span>
      </span>
    );
  }

  // Format with commas for thousands and split for decimals
  const parts = num
    .toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .split('.');
  const opacity = parts[1] === '00' ? 'opacity-60' : '';
  return (
    <span className={styles.numberContainer}>
      {parts[0]}
      <span className={`${styles.decimals} ${opacity}`}>{parts[1]}</span>
    </span>
  );
};

// Format quote with support for null values and quantity > 1
export const formatQuote = (quote: number | null, quantity: number = 1) => {
  // Check if quote is null or undefined
  if (quote == null) {
    return <div className={styles.noQuote}>No quote</div>;
  }

  // If quantity > 1, show total price and each price
  if (quantity > 1) {
    const totalPrice = quote * quantity;
    return (
      <div className={styles.priceContainer}>
        <div>{formatNumberWithSmallDecimals(totalPrice)}</div>
        <div className={styles.eachPrice}>
          ${formatNumberWithSmallDecimals(quote)} ea
        </div>
      </div>
    );
  }

  return formatNumberWithSmallDecimals(quote);
};

// Validate input for quote fields
export const validateQuoteInput = (value: string) => {
  return value === '' || /^\d*\.?\d{0,2}$/.test(value);
};
