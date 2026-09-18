import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import EmptyState from '../components/shared/EmptyState';
import ContactCard from '../components/contacts/ContactCard';
import ContactForm from '../components/contacts/ContactForm';
import SearchFilterBar from '../components/shared/SearchFilterBar';

const ROLE_OPTIONS = [
  { value: 'doctor', label: 'Doctor' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'lawyer', label: 'Lawyer' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'mechanic', label: 'Mechanic' },
  { value: 'insurance_agent', label: 'Insurance Agent' },
  { value: 'landlord', label: 'Landlord' },
  { value: 'vet', label: 'Vet' },
  { value: 'therapist', label: 'Therapist' },
  { value: 'other', label: 'Other' },
];

export default function Contacts() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Contact.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['contacts'] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Contact.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['contacts'] }); setEditing(null); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Contact.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
  });

  const handleSave = (data) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filtered = useMemo(() => {
    let result = [...contacts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    }
    if (roleFilter !== 'all') {
      result = result.filter(c => c.role === roleFilter);
    }
    return result;
  }, [contacts, search, roleFilter]);

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle={`${contacts.length} important people`}
        onAdd={() => { setEditing(null); setShowForm(true); }}
        addLabel="Add contact"
      />

      <SearchFilterBar
        search={search}
        onSearch={setSearch}
        filterValue={roleFilter}
        onFilter={setRoleFilter}
        filterOptions={ROLE_OPTIONS}
        filterPlaceholder="Filter by role"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 h-36 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={contacts.length === 0 ? "No contacts yet" : "No results found"}
          description={contacts.length === 0 ? "Save your important contacts — doctor, lawyer, plumber — so they're always a tap away." : "Try adjusting your search or filters."}
          onAdd={contacts.length === 0 ? () => setShowForm(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <ContactCard
              key={c.id}
              contact={c}
              index={i}
              onEdit={() => { setEditing(c); setShowForm(true); }}
              onDelete={() => deleteMutation.mutate(c.id)}
            />
          ))}
        </div>
      )}

      <ContactForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
