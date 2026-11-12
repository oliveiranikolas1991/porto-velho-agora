'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch(isSignup ? '/api/cadastro' : '/api/entrar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form.entries()))
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Tente novamente.');
      router.push(isSignup ? '/entrar?cadastro=ok' : '/');
      router.refresh();
    } catch (err) { setError(err.message || 'Ocorreu um erro inesperado.'); }
    finally { setBusy(false); }
  }

  return <form onSubmit={submit} className="stack-form">
    {error && <div className="form-alert" role="alert">{error}</div>}
    {isSignup && <label className="field"><span>Seu nome completo</span><input required name="nome" type="text" minLength={2} maxLength={100} autoComplete="name" placeholder="Como podemos te chamar?"/></label>}
    <label className="field"><span>E-mail</span><input required name="email" type="email" maxLength={150} autoComplete="email" placeholder="voce@exemplo.com"/></label>
    <label className="field"><span>Senha</span><div className="password-row"><input required name="senha" type={showPassword ? 'text' : 'password'} minLength={isSignup ? 8 : undefined} maxLength={72} autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder={isSignup ? 'Mínimo de 8 caracteres' : 'Sua senha'}/><button type="button" className="show-password" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? 'Ocultar' : 'Mostrar'}</button></div></label>
    <button type="submit" disabled={busy} className="btn btn-primary submit-button">{busy ? 'Aguarde…' : isSignup ? 'Criar minha conta' : 'Entrar na minha conta'}</button>
    <p className="form-switch">{isSignup ? <>Já tem uma conta? <Link href="/entrar">Faça login</Link></> : <>Ainda não tem conta? <Link href="/cadastrar">Cadastre-se grátis</Link></>}</p>
  </form>;
}
