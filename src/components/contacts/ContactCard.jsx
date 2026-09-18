import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Pencil, Trash2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const roleIcons = {
  doctor: '🩺', dentist: '🦷', lawyer: '⚖️', accountant: '📊',
  plumber: '🔧', electrician: '⚡', mechanic: '🔩', insurance_agent: '🛡️',
  landlord: '🏠', vet: '🐾', therapist: '🧠', other: '👤'
};

export default function ContactCard({ contact, onEdit, onDelete, index }) {
  const c = contact;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-card rounded-2xl border border-border/50 p-5 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-lg">
            {roleIcons[c.role] || '👤'}
          </div>
          <div>
            <p className="font-medium">{c.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{c.role?.replace(/_/g, ' ')}</p>
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
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 space-y-2">
        {c.phone && (
          <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="w-3.5 h-3.5" />
            {c.phone}
          </a>
        )}
        {c.email && (
          <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="w-3.5 h-3.5" />
            {c.email}
          </a>
        )}
        {c.notes && (
          <p className="text-xs text-muted-foreground pt-1 border-t border-border/50">{c.notes}</p>
        )}
      </div>
    </motion.div>
  );
}
