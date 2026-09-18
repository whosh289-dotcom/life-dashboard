import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, FileText, Users, AlertTriangle } from 'lucide-react';
import { differenceInDays, isPast } from 'date-fns';
import { motion } from 'framer-motion';
import StatCard from '../components/dashboard/StatCard';
import UpcomingTimeline from '../components/dashboard/UpcomingTimeline';
import SpendingChart from '../components/dashboard/SpendingChart';
import { useCurrency } from '../lib/CurrencyContext';

export default function Dashboard() {
  const { fmt } = useCurrency();
  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.entities.Subscription.list(),
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list(),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list(),
  });

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const monthlySpend = activeSubscriptions.reduce((sum, s) => {
    const cost = s.billing_cycle === 'yearly' ? s.cost / 12 : s.billing_cycle === 'quarterly' ? s.cost / 3 : s.cost;
    return sum + cost;
  }, 0);

  const expiringDocs = documents.filter(d => {
    if (!d.expiry_date) return false;
    const days = differenceInDays(new Date(d.expiry_date), new Date());
    return days <= 30 && !isPast(new Date(d.expiry_date));
  });

  const expiredDocs = documents.filter(d => d.expiry_date && isPast(new Date(d.expiry_date)));

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Good {getTimeOfDay()}</h1>
        <p className="text-muted-foreground mt-1">Here's what needs your attention</p>
      </motion.div>

      {(expiredDocs.length > 0 || expiringDocs.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-accent/10 border border-accent/20 rounded-2xl p-4 flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-accent shrink-0" />
          <p className="text-sm">
            {expiredDocs.length > 0 && <span className="font-medium">{expiredDocs.length} expired document{expiredDocs.length > 1 ? 's' : ''}</span>}
            {expiredDocs.length > 0 && expiringDocs.length > 0 && ' and '}
            {expiringDocs.length > 0 && <span className="font-medium">{expiringDocs.length} expiring soon</span>}
            {' — review your documents.'}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard
          title="Monthly Spend"
          value={fmt(monthlySpend)}
          subtitle={`${activeSubscriptions.length} active`}
          icon={CreditCard}
          accentColor="bg-accent/10"
        />
        <StatCard
          title="Documents"
          value={documents.length}
          subtitle={expiringDocs.length > 0 ? `${expiringDocs.length} expiring soon` : 'All up to date'}
          icon={FileText}
          accentColor="bg-primary/10"
        />
        <StatCard
          title="Contacts"
          value={contacts.length}
          subtitle="Important people"
          icon={Users}
          accentColor="bg-secondary"
        />
        <StatCard
          title="Yearly Cost"
          value={fmt(monthlySpend * 12)}
          subtitle="Projected annually"
          icon={CreditCard}
          accentColor="bg-muted"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Spending Breakdown</h2>
          <SpendingChart subscriptions={subscriptions} />
        </div>

        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Coming Up</h2>
          <UpcomingTimeline subscriptions={subscriptions} documents={documents} />
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
