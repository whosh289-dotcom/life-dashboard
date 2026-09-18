import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import EmptyState from '../components/shared/EmptyState';
import DocumentCard from '../components/documents/DocumentCard';
import DocumentForm from '../components/documents/DocumentForm';
import SearchFilterBar from '../components/shared/SearchFilterBar';

const DOC_TYPE_OPTIONS = [
  { value: 'passport', label: 'Passport' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'insurance', label: 'Insurance' },
  { value: 'warranty', label: 'Warranty' },
  { value: 'lease', label: 'Lease' },
  { value: 'registration', label: 'Registration' },
  { value: 'medical', label: 'Medical' },
  { value: 'tax', label: 'Tax' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'other', label: 'Other' },
];

export default function Documents() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortByExpiry, setSortByExpiry] = useState(false);
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Document.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['documents'] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Document.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['documents'] }); setEditing(null); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const handleSave = (data) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filtered = useMemo(() => {
    let result = [...documents];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.reference_number?.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== 'all') {
      result = result.filter(d => d.type === typeFilter);
    }
    if (sortByExpiry) {
      result.sort((a, b) => {
        if (!a.expiry_date) return 1;
        if (!b.expiry_date) return -1;
        return new Date(a.expiry_date) - new Date(b.expiry_date);
      });
    }
    return result;
  }, [documents, search, typeFilter, sortByExpiry]);

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle={`${documents.length} tracked`}
        onAdd={() => { setEditing(null); setShowForm(true); }}
        addLabel="Add document"
      />

      <SearchFilterBar
        search={search}
        onSearch={setSearch}
        filterValue={typeFilter}
        onFilter={setTypeFilter}
        filterOptions={DOC_TYPE_OPTIONS}
        filterPlaceholder="Filter by type"
        sortByExpiry={sortByExpiry}
        onToggleSortByExpiry={() => setSortByExpiry(v => !v)}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 h-36 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={documents.length === 0 ? "No documents yet" : "No results found"}
          description={documents.length === 0 ? "Keep track of important documents and never miss an expiry date again." : "Try adjusting your search or filters."}
          onAdd={documents.length === 0 ? () => setShowForm(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              index={i}
              onEdit={() => { setEditing(doc); setShowForm(true); }}
              onDelete={() => deleteMutation.mutate(doc.id)}
            />
          ))}
        </div>
      )}

      <DocumentForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
