import React from 'react';
import { base44 } from '@/api/base44Client';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GuestBanner() {
  return (
    <div className="bg-primary text-primary-foreground px-4 py-2.5 flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4 shrink-0" />
        <span>You're browsing as a guest — your data won't be saved.</span>
      </div>
      <Button
        size="sm"
        variant="secondary"
        className="shrink-0 rounded-lg gap-1 text-xs"
        onClick={() => base44.auth.redirectToLogin(window.location.href)}
      >
        Sign in <ArrowRight className="w-3 h-3" />
      </Button>
    </div>
  );
}
