'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './Icons';
import { CATEGORIAS, MAX_IMAGEM } from '../lib/validation';

export default function NewAvisoForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState('');
  const router = useRouter();
  async function submit(event) {
    event.preventDefault(); setError('');
    const data = new FormData(event.currentTarget);
    const file = data.get('imagem');
    if (file?.size > MAX_IMAGEM) { setError('A imagem deve ter até 2 MB.'); return; }
    setBusy(true);
    try {
      const response = await fetch('/api/avisos', { method:'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível publicar.');
      router.push(`/avisos/${result.id}`);
      router.refresh();
    } catch (err) { setError(err.message || 'Erro inesperado.'); }
    finally { setBusy(false); }
  }
  return <form className="stack-form publish-form" onSubmit={submit}>
    {error && <div className="form-alert" role="alert">{error}</div>}
    <label className="field"><span>Título do aviso <strong aria-hidden="true">*</strong></span><input name="titulo" type="text" required minLength={5} maxLength={120} placeholder="Ex.: Alagamento na Av. Calama"/></label>
    <label className="field"><span>Descrição <strong aria-hidden="true">*</strong></span><textarea name="descricao" required minLength={10} maxLength={5000} rows={5} placeholder="Conte o que está acontecendo, onde e outras informações úteis para a comunidade."/></label>
    <div className="field-grid">
      <label className="field"><span>Categoria <strong aria-hidden="true">*</strong></span><select name="categoria" defaultValue="" required><option value="" disabled>Selecione</option>{CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></label>
      <label className="field"><span>Bairro <strong aria-hidden="true">*</strong></span><input name="bairro" required minLength={2} maxLength={80} placeholder="Ex.: Nova Porto Velho"/></label>
    </div>
    <label className="field"><span>Foto (opcional)</span><span className="upload-zone"><Icon name="image" size={29}/><strong>{photo || 'Adicionar uma foto do local'}</strong><small>JPG, PNG ou WEBP • até 2 MB</small><input name="imagem" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(e) => setPhoto(e.target.files?.[0]?.name || '')}/></span></label>
    <div className="publish-actions"><p><Icon name="shield" size={16}/> Seu aviso ficará visível para todos imediatamente.</p><button type="submit" disabled={busy} className="btn btn-primary"><Icon name="plus" size={18}/>{busy ? 'Publicando…' : 'Publicar aviso'}</button></div>
  </form>;
}
