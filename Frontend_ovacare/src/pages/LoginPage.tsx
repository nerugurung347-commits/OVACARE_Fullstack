import React, { useState } from 'react';
import FormField from '../components/FormField';
import Button from '../components/Button';
import type { AuthData } from '../types';

interface LoginPageProps {
  data: AuthData;
  onComplete: (data: AuthData) => void;
}

function LoginPage({ data: _data, onComplete }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loginError, setLoginError] = useState('');

  const errors = {
    email: !email.includes('@') || !email.includes('.') ? 'Please enter a valid email address' : '',
    password: !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$/.test(password)
      ? 'Password must be at least 8 characters and include a letter, number and symbol'
      : '',
  };

  const isValid = !errors.email && !errors.password;

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      if (email === 'demo@ovacare.com' && password === 'Test@1234') {
        onComplete({ name: '', email, password });
      } else {
        setLoginError('Invalid credentials. Please check your email and password and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary-100 flex items-center justify-center p-4 page-fade">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[420px] p-8">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center shadow-md">
            <span className="text-2xl">🌿</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary-600 text-center mb-2">
          Ovacare
        </h1>
        <p className="text-gray-500 italic text-center">
          Live in sync with your cycle
        </p>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-primary-500/30"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40"></div>
          <div className="flex-1 h-px bg-primary-500/30"></div>
        </div>

        {loginError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div onBlur={() => handleBlur('email')}>
            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
              error={errors.email}
              touched={touched.email}
              placeholder="you@example.com"
            />
          </div>

          <div onBlur={() => handleBlur('password')}>
            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
              error={errors.password}
              touched={touched.password}
              placeholder="At least 8 characters"
            />
            <p className="text-xs text-gray-400 mt-1">Use 8+ characters with letters, numbers and symbols</p>
          </div>

          <div className="mt-6">
            <Button
              label="Sign In"
              type="submit"
              fullWidth
              disabled={!isValid}
            />
            <p className="text-xs text-gray-400 mt-3 text-center">
              Demo credentials: demo@ovacare.com / Test@1234
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;