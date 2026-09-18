import React, { useState } from 'react';
import { Truck, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Server, Loader2 } from 'lucide-react';
import { RouteSphereApi, ApiError } from '../../api';

interface LoginScreenProps {
  onLoggedIn: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoggedIn }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [apiUrl, setApiUrl] = useState(RouteSphereApi.getApiUrl());
  const [showConfig, setShowConfig] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'DISPATCHER' | 'ADMIN' | 'DRIVER'>('DISPATCHER');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    RouteSphereApi.setApiUrl(apiUrl);
    try {
      if (mode === 'login') {
        await RouteSphereApi.login(email.trim(), password);
        onLoggedIn();
      } else {
        await RouteSphereApi.register({ name, email: email.trim(), password, role });
        setInfo('Account created. Signing you in...');
        await RouteSphereApi.login(email.trim(), password);
        onLoggedIn();
      }
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Could not reach the API. Check the backend URL and that it is running.');
    } finally {
      setBusy(false);
    }
  };

  const continueDemo = () => {
    RouteSphereApi.setDemoMode(true);
    onLoggedIn();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-50 px-4 py-10">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'linear-gradient(#e3e7ee 1px, transparent 1px), linear-gradient(90deg, #e3e7ee 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative w-full max-w-[400px] animate-rise">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lift">
            <Truck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-[22px] font-bold tracking-tight text-ink-900">RouteSphere</h1>
          <p className="mt-1 text-[13px] text-ink-500">
            Fleet &amp; logistics operations console
          </p>
        </div>

        <div className="panel p-6 shadow-lift">
          <div className="mb-5 flex rounded-lg bg-ink-100 p-0.5">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`flex-1 rounded-md py-1.5 text-[12.5px] font-semibold capitalize transition-colors ${
                  mode === m ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' ? (
              <div>
                <label className="field-label">Full name</label>
                <input
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Abhiram B"
                  required
                />
              </div>
            ) : null}

            <div>
              <label className="field-label">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  className="field pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  className="field pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {mode === 'register' ? (
              <div>
                <label className="field-label">Role</label>
                <select
                  className="field"
                  value={role}
                  onChange={(e) => setRole(e.target.value as typeof role)}
                >
                  <option value="DISPATCHER">Dispatcher — full ops access</option>
                  <option value="ADMIN">Admin — user management</option>
                  <option value="DRIVER">Driver — fuel &amp; maintenance</option>
                </select>
              </div>
            ) : null}

            {error ? (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12.5px] text-rose-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}
            {info ? (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12.5px] text-emerald-700">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{info}</span>
              </div>
            ) : null}

            <button type="submit" disabled={busy} className="btn-primary w-full py-2.5">
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Connecting…
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink-200" />
            <span className="label-mono">or</span>
            <span className="h-px flex-1 bg-ink-200" />
          </div>

          <button onClick={continueDemo} className="btn-ghost w-full py-2.5">
            Continue with demo data
          </button>
          <p className="mt-3 text-center text-[11.5px] text-ink-400">
            Explore the full console without a backend.
          </p>
        </div>

        <button
          onClick={() => setShowConfig((v) => !v)}
          className="mx-auto mt-5 flex items-center gap-1.5 text-[12px] font-medium text-ink-500 hover:text-ink-800"
        >
          <Server className="h-3.5 w-3.5" />
          API endpoint
        </button>
        {showConfig ? (
          <div className="mt-3 animate-rise">
            <input
              className="field font-mono text-[12px]"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8080"
            />
            <p className="mt-2 text-center text-[11px] text-ink-400">
              Spring Boot REST base URL. Saved locally.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
