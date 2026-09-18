import React from 'react';
import { format, differenceInDays, isPast } from 'date-fns';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CreditCard, FileText } from 'lucide-react';

export default function UpcomingTimeline({ subscriptions, documents }) {
  const events = [];

  subscriptions
    .filter(s => s.status === 'active' && s.next_billing_date)
    .forEach(s => {
      events.push({
        type: 'billing',
        name: s.name,
        date: new Date(s.next_billing_date),
        detail: `$${s.cost}`,
        icon: CreditCard,
      });
    });

  documents
    .filter(d => d.expiry_date)
    .forEach(d => {
      events.push({
        type: 'expiry',
        name: d.name,
        date: new Date(d.expiry_date),
        detail: d.type?.replace(/_/g, ' '),
        icon: FileText,
      });
    });

  events.sort((a, b) => a.date - b.date);
  const upcoming = events.slice(0, 8);

  if (upcoming.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No upcoming events yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {upcoming.map((event, i) => {
        const daysAway = differenceInDays(event.date, new Date());
        const isOverdue = isPast(event.date);
        const isUrgent = daysAway <= 7 && !isOverdue;
        const Icon = event.icon;

        return (
          <motion.div
            key={`${event.name}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isOverdue ? 'bg-destructive/10' : isUrgent ? 'bg-accent/10' : 'bg-secondary'
            }`}>
              {isOverdue ? (
                <AlertTriangle className="w-4 h-4 text-destructive" />
              ) : (
                <Icon className={`w-4 h-4 ${isUrgent ? 'text-accent' : 'text-muted-foreground'}`} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{event.name}</p>
              <p className="text-xs text-muted-foreground">{event.detail}</p>
            </div>

            <div className="text-right shrink-0">
              <p className={`text-xs font-medium ${
                isOverdue ? 'text-destructive' : isUrgent ? 'text-accent' : 'text-muted-foreground'
              }`}>
                {isOverdue ? 'Overdue' : daysAway === 0 ? 'Today' : `${daysAway}d`}
              </p>
              <p className="text-xs text-muted-foreground">{format(event.date, 'MMM d')}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
