import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ROLES = ['doctor', 'dentist', 'lawyer', 'accountant', 'plumber', 'electrician', 'mechanic', 'insurance_agent', 'landlord', 'vet', 'therapist', 'other'];

export default function ContactForm({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || {
    name: '', role: 'other', phone: '', email: '', address: '', notes: ''
  });

  const handleSave = () => {
    if (!form.name) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{initial ? 'Edit' : 'Add'} Contact</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Dr. Smith" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm({...form, role: v})}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => (
                    <SelectItem key={r} value={r}>{r.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 555-0123" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="dr@example.com" className="mt-1 rounded-xl" />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="123 Main St" className="mt-1 rounded-xl" />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Best time to call..." className="mt-1 rounded-xl" />
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
