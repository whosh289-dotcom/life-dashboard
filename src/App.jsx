import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';

import AppLayout from './components/layout/AppLayout';
import TokenProvider from './components/layout/TokenProvider';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import Documents from './pages/Documents';
import Contacts from './pages/Contacts';
import GuestLanding from './pages/GuestLanding';
import PageNotFound from './lib/PageNotFound';

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = 'pk_test_bm90ZWQtc2FsbW9uLTE1MjUuY2xlcmsuYWNjb3VudHMuZGV2JA';

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <GuestLanding />
                </SignedOut>
              </>
            } />
            <Route path="/login" element={
              <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
                <SignIn fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard" />
              </div>
            } />

            {/* Protected Routes inside AppLayout */}
            <Route element={
              <>
                <SignedIn>
                  <TokenProvider>
                    <AppLayout />
                  </TokenProvider>
                </SignedIn>
                <SignedOut>
                  <Navigate to="/login" replace />
                </SignedOut>
              </>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/contacts" element={<Contacts />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
