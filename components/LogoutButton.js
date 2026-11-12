'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function leave() {
    setBusy(true);
    try {
      const res = await fetch('/api/sair', { method: 'POST' });
      if (!res.ok) throw new Error();
      router.push('/');
      router.refresh();
    } catch { alert('Não foi possível sair agora. Tente novamente.'); }
    finally { setBusy(false); }
  }
  return <button className="nav-exit" type="button" onClick={leave} disabled={busy}>{busy ? 'Saindo…' : 'Sair'}</button>;
}
