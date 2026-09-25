import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, FileText, Users, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserButton, SignOutButton } from '@clerk/clerk-react';
import CurrencyPicker from './CurrencyPicker';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/contacts', label: 'Contacts', icon: Users },
];

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onToggle} />
      )}

      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={onToggle}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <aside className={`
        fixed top-0 left-0 h-full z-50 w-64
        bg-sidebar text-sidebar-foreground
        flex flex-col
        transition-transform duration-300 ease-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 pb-2 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Life<span className="text-sidebar-primary">Admin</span>
            </h1>
            <p className="text-xs text-sidebar-foreground/50 mt-1">Your personal command center</p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={onToggle}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <CurrencyPicker />
        <div className="p-4 border-t border-sidebar-border">
          <SignOutButton signOutCallback={() => window.location.href = "/"}>
            <button className="flex items-center gap-3 px-4 py-2 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors w-full">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
}
