import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { useCurrency } from '../lib/CurrencyContext';
import EmptyState from '../components/shared/EmptyState';
import SubscriptionCard from '../components/subscriptions/SubscriptionCard';
import SubscriptionForm from '../components/subscriptions/SubscriptionForm';

export default function Subscriptions() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Subscription.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subscriptions'] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Subscription.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subscriptions'] }); setEditing(null); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Subscription.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions'] }),
  });

  const handleSave = (data) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleToggleStatus = (sub) => {
    updateMutation.mutate({
      id: sub.id,
      data: { status: sub.status === 'active' ? 'paused' : 'active' }
    });
  };

  const { fmt } = useCurrency();
  const active = subscriptions.filter(s => s.status === 'active');
  const inactive = subscriptions.filter(s => s.status !== 'active');

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        subtitle={`${active.length} active · ${fmt(active.reduce((sum, s) => {
          const cost = s.billing_cycle === 'yearly' ? s.cost / 12 : s.billing_cycle === 'quarterly' ? s.cost / 3 : s.cost;
          return sum + cost;
        }, 0))}/mo`}
        onAdd={() => { setEditing(null); setShowForm(true); }}
        addLabel="Add subscription"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 h-36 animate-pulse" />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No subscriptions yet"
          description="Start tracking your recurring expenses to see where your money goes each month."
          onAdd={() => setShowForm(true)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map((s, i) => (
              <SubscriptionCard
                key={s.id}
                subscription={s}
                index={i}
                onEdit={() => { setEditing(s); setShowForm(true); }}
                onDelete={() => deleteMutation.mutate(s.id)}
                onToggleStatus={() => handleToggleStatus(s)}
              />
            ))}
          </div>
          {inactive.length > 0 && (
            <>
              <h3 className="font-display text-lg font-semibold mt-10 mb-4 text-muted-foreground">Paused & Cancelled</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactive.map((s, i) => (
                  <SubscriptionCard
                    key={s.id}
                    subscription={s}
                    index={i}
                    onEdit={() => { setEditing(s); setShowForm(true); }}
                    onDelete={() => deleteMutation.mutate(s.id)}
                    onToggleStatus={() => handleToggleStatus(s)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <SubscriptionForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
