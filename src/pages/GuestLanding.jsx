import React from 'react';
import { Shield, Cloud, Lock, ArrowRight, Zap, Bell, CreditCard, Users, FileText } from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';

function Feature({ icon: Icon, label, desc }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/50">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground mt-1 leading-snug">{desc}</p>
      </div>
    </div>
  );
}

export default function GuestLanding() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20">
          <Shield className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Life<span className="text-primary">Admin</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
          Your personal command centre for life's important stuff. Secure, synced, and beautiful.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 text-left">
          <Feature icon={CreditCard} label="Subscriptions" desc="Track recurring costs & upcoming renewals." />
          <Feature icon={FileText} label="Documents" desc="Securely store IDs, passports, & contracts." />
          <Feature icon={Users} label="Contacts" desc="Keep emergency and service contacts handy." />
          <Feature icon={Bell} label="Reminders" desc="Never miss an expiry date again." />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignInButton mode="modal">
            <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all flex items-center justify-center">
              Create Free Account
            </button>
          </SignUpButton>
        </div>

        <div className="mt-16 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Cloud className="w-4 h-4" /> Cloud Sync</span>
          <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> End-to-end Secure</span>
          <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Lightning Fast</span>
        </div>
      </div>
    </div>
  );
}
