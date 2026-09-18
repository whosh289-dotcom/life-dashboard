import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency, CURRENCIES } from '@/lib/CurrencyContext';

export default function CurrencyPicker() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="px-3 pb-4">
      <p className="text-xs text-sidebar-foreground/40 uppercase tracking-widest px-4 mb-2">Currency</p>
      <Select value={currency.code} onValueChange={setCurrency}>
        <SelectTrigger className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground rounded-xl text-sm h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CURRENCIES.map(c => (
            <SelectItem key={c.code} value={c.code}>
              <span className="font-medium">{c.symbol}</span>
              <span className="text-muted-foreground ml-2">{c.code} — {c.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
