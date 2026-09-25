import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CATEGORIES = ['streaming', 'software', 'fitness', 'news', 'food', 'shopping', 'cloud_storage', 'music', 'gaming', 'other'];

export default function SubscriptionForm({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || {
    name: '', category: 'other', cost: '', billing_cycle: 'monthly', next_billing_date: '', status: 'active', notes: ''
  });

  const handleSave = () => {
    if (!form.name || !form.cost) return;
    onSave({ ...form, cost: parseFloat(form.cost) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{initial ? 'Edit' : 'Add'} Subscription</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Service Name</Label>
            <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Netflix, Spotify..." className="mt-1 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Cost</Label>
              <Input type="number" step="0.01" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} placeholder="9.99" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Billing Cycle</Label>
              <Select value={form.billing_cycle} onValueChange={v => setForm({...form, billing_cycle: v})}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Next Billing Date</Label>
              <Input type="date" value={form.next_billing_date} onChange={e => setForm({...form, next_billing_date: e.target.value})} className="mt-1 rounded-xl" />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Shared with family..." className="mt-1 rounded-xl" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="rounded-xl">Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
