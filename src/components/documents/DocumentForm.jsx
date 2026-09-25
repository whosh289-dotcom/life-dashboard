import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { Upload, Loader2 } from 'lucide-react';

const DOC_TYPES = ['passport', 'drivers_license', 'insurance', 'warranty', 'lease', 'registration', 'medical', 'tax', 'certificate', 'other'];

export default function DocumentForm({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || {
    name: '', type: 'other', expiry_date: '', issue_date: '', reference_number: '', file_url: '', notes: ''
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Hard limit database chunking to 5MB to save space
    if (file.size > 5 * 1024 * 1024) {
      setError('Please keep files under 5MB to conserve database space.');
      return;
    }
    setError('');
    setUploading(true);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm(prev => ({ ...prev, file_url }));
    } catch(e) {
      setError('Upload failed');
    }
    setUploading(false);
  };

  const handleSave = () => {
    if (!form.name) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{initial ? 'Edit' : 'Add'} Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Passport" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Issue Date</Label>
              <Input type="date" value={form.issue_date} onChange={e => setForm({...form, issue_date: e.target.value})} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Expiry Date</Label>
              <Input type="date" value={form.expiry_date} onChange={e => setForm({...form, expiry_date: e.target.value})} className="mt-1 rounded-xl" />
            </div>
          </div>
          <div>
            <Label>Upload File (Max 5MB)</Label>
            <div className="mt-1">
              {form.file_url ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate flex-1">File attached</span>
                  <Button variant="ghost" size="sm" onClick={() => setForm({...form, file_url: ''})}>Remove</Button>
                </div>
              ) : (
                <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border cursor-pointer hover:bg-muted/50 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-sm text-muted-foreground">{uploading ? 'Processing...' : 'Choose file (< 5MB)'}</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              )}
            </div>
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Location..." className="mt-1 rounded-xl" />
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
