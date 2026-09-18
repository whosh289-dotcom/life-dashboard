import React from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays, isPast } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const typeIcons = {
  passport: '🛂', drivers_license: '🪪', insurance: '🛡️', warranty: '📋',
  lease: '🏠', registration: '📝', medical: '🏥', tax: '💰',
  certificate: '📜', other: '📄'
};

export default function DocumentCard({ document: doc, onEdit, onDelete, index }) {
  const isExpired = doc.expiry_date && isPast(new Date(doc.expiry_date));
  const daysUntilExpiry = doc.expiry_date ? differenceInDays(new Date(doc.expiry_date), new Date()) : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-card rounded-2xl border p-5 hover:shadow-md transition-all duration-300 ${
        isExpired ? 'border-destructive/30' : isExpiringSoon ? 'border-accent/30' : 'border-border/50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-lg">
            {typeIcons[doc.type] || '📄'}
          </div>
          <div>
            <p className="font-medium">{doc.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{doc.type?.replace(/_/g, ' ')}</p>
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
            {doc.file_url && (
              <DropdownMenuItem onClick={() => window.open(doc.file_url, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" /> View File
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          {doc.reference_number && (
            <p className="text-xs text-muted-foreground font-mono">#{doc.reference_number}</p>
          )}
          {doc.expiry_date && (
            <p className="text-sm mt-1">
              Expires {format(new Date(doc.expiry_date), 'MMM d, yyyy')}
            </p>
          )}
        </div>
        {isExpired && <Badge variant="destructive" className="text-xs">Expired</Badge>}
        {isExpiringSoon && <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">Expiring soon</Badge>}
        {!isExpired && !isExpiringSoon && doc.expiry_date && (
          <Badge variant="secondary" className="text-xs">{daysUntilExpiry}d left</Badge>
        )}
      </div>
    </motion.div>
  );
}
