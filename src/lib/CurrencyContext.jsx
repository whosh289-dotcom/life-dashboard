import React, { createContext, useContext, useState } from 'react';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', label: 'Swiss Franc' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', label: 'Mexican Peso' },
  { code: 'SEK', symbol: 'kr', label: 'Swedish Krona' },
  { code: 'NZD', symbol: 'NZ$', label: 'New Zealand Dollar' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', label: 'Hong Kong Dollar' },
  { code: 'NOK', symbol: 'kr', label: 'Norwegian Krone' },
];

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(
    () => localStorage.getItem('lifeadmin_currency') || 'USD'
  );

  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  const setCurrency = (code) => {
    setCurrencyCode(code);
    localStorage.setItem('lifeadmin_currency', code);
  };

  const fmt = (amount) => `${currency.symbol}${Number(amount).toFixed(0)}`;
  const fmtDecimals = (amount) => `${currency.symbol}${Number(amount).toFixed(2)}`;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, fmt, fmtDecimals }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
