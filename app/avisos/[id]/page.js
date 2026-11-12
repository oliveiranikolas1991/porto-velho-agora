import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAviso } from '../../../lib/avisos';
import { formatDate } from '../../../lib/format';
import { Icon, ICON_BY_CATEGORY } from '../../../components/Icons';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const { id } = await params;
  const aviso = await getAviso(id);
  return { title: aviso?.titulo || 'Aviso não encontrado', description: aviso?.descricao?.slice(0,155) || '' };
}
export default async function AvisoDetalhes({ params }) {
  const { id } = await params;
  const aviso = await getAviso(id);
  if (!aviso) notFound();
  return <section className="detail-page container"><div className="breadcrumb"><Link href="/">Início</Link><Icon name="chevron" size={16}/> <Link href="/#avisos">Avisos</Link><Icon name="chevron" size={16}/> Detalhes</div><div className="detail-layout"><article className="detail-card"><div className="detail-card-content"><span className="detail-category"><Icon name={ICON_BY_CATEGORY[aviso.categoria] || 'info'} size={17}/>{aviso.categoria}</span><h1>{aviso.titulo}</h1><div className="detail-meta"><span><Icon name="pin" size={17}/>{aviso.bairro}, Porto Velho</span><span><Icon name="clock" size={17}/>{formatDate(aviso.criado_em)}</span><span><Icon name="user" size={17}/>{aviso.autor}</span></div></div>{aviso.imagem_url && <div className="detail-image"><img src={aviso.imagem_url} alt={`Foto que acompanha o aviso: ${aviso.titulo}`}/></div>}<div className="detail-description"><h2>Sobre este aviso</h2><p>{aviso.descricao}</p></div><div className="detail-back"><Link href="/#avisos" className="btn btn-outline">← Voltar para os avisos</Link></div></article><aside className="detail-aside"><div className="aside-card"><span className="aside-icon"><Icon name="shield" size={23}/></span><h3>Informação comunitária</h3><p>Este aviso foi enviado por um colaborador. O conteúdo é de responsabilidade de quem publicou. Verifique informações importantes diretamente com fontes oficiais.</p></div><div className="aside-card aside-cta"><h3>Algo acontecendo perto de você?</h3><p>Compartilhe um aviso e ajude a comunidade.</p><Link className="btn btn-primary btn-full" href="/publicar"><Icon name="plus" size={18}/> Publicar aviso</Link></div></aside></div></section>;
}
