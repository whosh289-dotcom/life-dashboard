import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await base44.auth.login(email, password);
      } else {
        await base44.auth.register(email, password);
      }
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      icon={Lock}
      title={isLogin ? 'Welcome back' : 'Create an account'}
      subtitle={isLogin ? 'Enter your details to sign in' : 'Start managing your life admin'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-xl">{error}</div>}
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 rounded-xl" />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 rounded-xl" />
        </div>
        <Button type="submit" className="w-full rounded-xl mt-4">
          {isLogin ? 'Sign In' : 'Register'}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </AuthLayout>
  );
}
