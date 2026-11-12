import Link from 'next/link';
import { formatDate, summarize } from '../lib/format';
import { Icon, ICON_BY_CATEGORY } from './Icons';

export default function AvisoCard({ aviso }) {
  return <article className="notice-card">
    <Link href={`/avisos/${aviso.id}`} className="notice-link" aria-label={`Ler aviso: ${aviso.titulo}`}>
      <div className={`notice-media ${aviso.imagem_url ? 'notice-media-photo' : ''}`}>
        {aviso.imagem_url ? <img src={aviso.imagem_url} alt={`Imagem do aviso: ${aviso.titulo}`} loading="lazy"/> : <div className="notice-placeholder"><div className="round-illustration"><Icon name={ICON_BY_CATEGORY[aviso.categoria] || 'info'} size={39} stroke={1.45}/></div><span>PORTO VELHO AGORA</span></div>}
        <span className={`category-label category-${aviso.categoria?.toLowerCase()}`}><Icon name={ICON_BY_CATEGORY[aviso.categoria] || 'info'} size={13}/>{aviso.categoria}</span>
      </div>
      <div className="notice-content">
        <div className="notice-location"><Icon name="pin" size={15}/>{aviso.bairro}</div>
        <h3>{aviso.titulo}</h3>
        <p>{summarize(aviso.descricao)}</p>
        <div className="notice-footer"><span><Icon name="clock" size={14}/>{formatDate(aviso.criado_em)}</span><span className="read-more">Ver aviso <Icon name="chevron" size={16}/></span></div>
      </div>
    </Link>
  </article>;
}
