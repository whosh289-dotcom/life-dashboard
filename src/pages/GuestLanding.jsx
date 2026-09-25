import React from 'react';
import { base44 } from '@/api/base44Client';
import { FileText, CreditCard, Users, Shield, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const features = [
  { icon: FileText, label: 'Track Documents', desc: 'Passport, insurance, warranties — never miss an expiry.' },
  { icon: CreditCard, label: 'Manage Subscriptions', desc: 'See exactly what you pay and when billing hits.' },
  { icon: Users, label: 'Save Key Contacts', desc: 'Doctor, lawyer, plumber — always a tap away.' },
  { icon: Shield, label: 'Private & Secure', desc: 'Your data is locked to your account only.' },
];

export default function GuestLanding({ onContinueAsGuest }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Lock className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight mb-2">Life Admin</h1>
        <p className="text-muted-foreground mb-10">Your personal command centre for life's important stuff.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-card border border-border/50 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Button
            className="w-full rounded-xl h-11 text-base gap-2"
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
          >
            Sign in to your account
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-xl h-11 text-base"
            onClick={onContinueAsGuest}
          >
            Explore as guest
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          Guest mode is view-only. Sign in to save your data.
        </p>
      </motion.div>
    </div>
  );
}
