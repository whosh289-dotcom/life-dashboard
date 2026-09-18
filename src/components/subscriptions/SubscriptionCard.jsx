import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2, Pause, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/lib/CurrencyContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const categoryIcons = {
  streaming: '📺', software: '💻', fitness: '🏋️', news: '📰',
  food: '🍕', shopping: '🛒', cloud_storage: '☁️', music: '🎵',
  gaming: '🎮', other: '📦'
};

export default function SubscriptionCard({ subscription, onEdit, onDelete, onToggleStatus, index }) {
  const s = subscription;
  const { fmtDecimals } = useCurrency();
  const monthlyCost = s.billing_cycle === 'yearly' ? s.cost / 12 : s.billing_cycle === 'quarterly' ? s.cost / 3 : s.cost;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-card rounded-2xl border border-border/50 p-5 hover:shadow-md transition-all duration-300 ${
        s.status !== 'active' ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-lg">
            {categoryIcons[s.category] || '📦'}
          </div>
          <div>
            <p className="font-medium">{s.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{s.category?.replace(/_/g, ' ')}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleStatus}>
              {s.status === 'active' ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {s.status === 'active' ? 'Pause' : 'Resume'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-end justify-between mt-4">
        <div>
          <p className="text-2xl font-display font-semibold">{fmtDecimals(s.cost)}<span className="text-sm font-sans text-muted-foreground">/{s.billing_cycle === 'monthly' ? 'mo' : s.billing_cycle === 'quarterly' ? 'qtr' : 'yr'}</span></p>
          {s.billing_cycle !== 'monthly' && (
            <p className="text-xs text-muted-foreground">{fmtDecimals(monthlyCost)}/mo effective</p>
          )}
        </div>
        <div className="text-right">
          {s.status !== 'active' && (
            <Badge variant="secondary" className="text-xs capitalize">{s.status}</Badge>
          )}
          {s.next_billing_date && s.status === 'active' && (
            <p className="text-xs text-muted-foreground">Next: {format(new Date(s.next_billing_date), 'MMM d')}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
