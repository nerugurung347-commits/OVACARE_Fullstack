import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { signUp } from '../api';

function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [formError, setFormError] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const errors = {
    name: !name.trim() ? 'Please enter your full name' : '',
    email: !email.includes('@') || !email.includes('.') ? 'Please enter a valid email address' : '',
    password: !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$/.test(password)
      ? 'Password must be at least 8 characters and include a letter, number and symbol'
      : '',
  };

  const isValid = !errors.name && !errors.email && !errors.password && consentChecked;

  const handleBlur = (field: 'name' | 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setFormError('');
    setSuccessMessage('');

    try {
      await signUp(name, email, password);
      setSuccessMessage('Account created! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed. Please try again.';
      setFormError(message);
    } finally {
      setLoading(false);
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

        {formError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {formError}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div onBlur={() => handleBlur('name')}>
            <FormField
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setFormError(''); }}
              error={errors.name}
              touched={touched.name}
              placeholder="Jane Doe"
            />
          </div>

          <div onBlur={() => handleBlur('email')}>
            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFormError(''); }}
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
              onChange={(e) => { setPassword(e.target.value); setFormError(''); }}
              error={errors.password}
              touched={touched.password}
              placeholder="At least 8 characters"
            />
            <p className="text-xs text-gray-400 mt-1">Use 8+ characters with letters, numbers and symbols</p>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
            />
            <label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer">
              I consent to Ovacare collecting my cycle and health data to personalise my experience. This data is stored only on my device and is never shared with third parties
            </label>
          </div>

          <div className="mt-6">
            <Button
              label="Sign Up"
              type="submit"
              fullWidth
              disabled={!isValid}
              loading={loading}
            />
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary-500 font-medium hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;