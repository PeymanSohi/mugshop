import { useState, useEffect } from 'react';

export type Currency = 'IRR';

interface ExchangeRates {
  IRR: number;
}

interface CurrencyData {
  currency: Currency;
  rates: ExchangeRates;
  isLoading: boolean;
  error: string | null;
}

// Mock exchange rates - in production, use a real API like exchangerate-api.com
const mockRates: ExchangeRates = {
  IRR: 1
};

export function useCurrency(): [CurrencyData, (currency: Currency) => void] {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || 'IRR';
  });
  
  const [rates, setRates] = useState<ExchangeRates>(mockRates);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In production, replace with real API
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/IRR');
        // const data = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setRates(mockRates);
      } catch (err) {
        setError('Failed to fetch exchange rates');
        console.error('Currency API error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
    
    // Update rates every 30 minutes
    const interval = setInterval(fetchRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const updateCurrency = (newCurrency: Currency) => {
    setCurrency('IRR');
    localStorage.setItem('currency', 'IRR');
  };

  return [
    { currency, rates, isLoading, error },
    updateCurrency
  ];
}

export function formatPrice(price: number, currency: Currency, rates: ExchangeRates): string {
  const convertedPrice = price * rates.IRR;
  return `${convertedPrice.toLocaleString('fa-IR')} تومان`;
}