import Link from 'next/link';
import { listAvisos } from '../lib/avisos';
import { CATEGORIAS } from '../lib/validation';
import { Icon, ICON_BY_CATEGORY } from '../components/Icons';
import AvisoCard from '../components/AvisoCard';
export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const categoria = typeof params?.categoria === 'string' && CATEGORIAS.includes(params.categoria) ? params.categoria : '';
  const bairro = typeof params?.bairro === 'string' ? params.bairro.slice(0,80) : '';
  let avisos = [], dbError = false;
  try { avisos = await listAvisos({ categoria, bairro }); }
  catch (err) { console.error('Erro de leitura do feed:', err?.code || 'internal'); dbError = true; }
  return <>
    <section className="hero"><div className="hero-pattern" aria-hidden="true"/><div className="container hero-grid">
      <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> INFORMAÇÃO LOCAL, DE VERDADE</div>
        <h1>Seu bairro.<br/>Sua cidade.<br/><span>Em primeira mão.</span></h1>
        <p>Fique por dentro do que acontece em Porto Velho e compartilhe informações que fazem a diferença na vida de todos.</p>
        <div className="hero-actions"><Link className="btn btn-accent" href="#avisos"><Icon name="arrow"/> Explorar avisos</Link><Link className="btn btn-ghost-light" href="/publicar"><Icon name="plus" size={19}/> Compartilhar informação</Link></div>
        <div className="hero-footnote"><Icon name="shield" size={16}/> Gratuito, colaborativo e feito para Porto Velho.</div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="hero-art-circle"><svg viewBox="0 0 430 440" fill="none"><path d="M84 363h261M115 363V146l101-75 101 75v217M154 362V219h123v143M187 219v-56h59v56M193 269h45v93M96 188l120-90 120 90M119 307H87v-86h29M313 306h32v-94h-28" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round"/><path d="M176 365v-73h83v73" stroke="currentColor" strokeWidth="7"/><circle cx="216" cy="120" r="17" stroke="currentColor" strokeWidth="7"/></svg></div><span className="art-bubble art-bubble-top"><Icon name="pin" size={19}/> Porto Velho · RO</span><span className="art-bubble art-bubble-bottom"><span className="live-dot"/> Comunidade conectada</span></div>
    </div></section>
    <section className="categories-strip container"><div className="strip-heading"><span className="section-kicker">ACOMPANHE A CIDADE</span><h2>O que está acontecendo?</h2></div><div className="category-options">
      {CATEGORIAS.map(cat => <Link href={`/?categoria=${encodeURIComponent(cat)}#avisos`} key={cat} className={`category-pill ${categoria===cat?'selected':''}`}><Icon name={ICON_BY_CATEGORY[cat]} size={19}/>{cat}</Link>)}
    </div></section>
    <section className="feed-section container" id="avisos"><div className="feed-main"><div className="section-heading"><div><span className="section-kicker">O PULSO DA CIDADE</span><h2>Avisos da comunidade</h2><p>Informações enviadas por pessoas que vivem a cidade.</p></div><span className="count-pill">{avisos.length} {avisos.length === 1 ? 'aviso' : 'avisos'}</span></div>
      <form method="get" action="/" className="filter-bar" aria-label="Filtros de avisos"><div className="filter-icon"><Icon name="filter" size={19}/></div><label><span>Categoria</span><select name="categoria" defaultValue={categoria}><option value="">Todas as categorias</option>{CATEGORIAS.map(cat=><option key={cat} value={cat}>{cat}</option>)}</select></label><label><span>Bairro</span><input name="bairro" type="text" maxLength={80} defaultValue={bairro} placeholder="Buscar por bairro"/></label><button className="btn btn-primary filter-button" type="submit">Filtrar</button>{(categoria || bairro) && <Link href="/#avisos" className="clear-filters">Limpar</Link>}</form>
      {dbError ? <div className="empty-state"><Icon name="alert" size={40}/><h3>Não foi possível carregar os avisos</h3><p>Confira se o banco está configurado e tente novamente.</p></div> : avisos.length ? <div className="notice-grid">{avisos.map(a => <AvisoCard aviso={a} key={a.id}/>)}</div> : <div className="empty-state"><Icon name="message" size={42}/><h3>{categoria || bairro ? 'Nenhum aviso com esses filtros' : 'A cidade está esperando a primeira notícia'}</h3><p>{categoria || bairro ? 'Tente outros filtros ou confira todos os avisos publicados.' : 'Seja a primeira pessoa a compartilhar algo importante no bairro.'}</p><Link href={categoria || bairro ? '/' : '/publicar'} className="btn btn-primary">{categoria || bairro ? 'Ver todos os avisos' : 'Publicar primeiro aviso'}</Link></div>}
    </div><aside className="feed-aside"><div className="aside-card aside-cta"><span className="aside-icon"><Icon name="message" size={26}/></span><h3>Viu algo importante no seu bairro?</h3><p>Uma informação sua pode ajudar centenas de pessoas. Compartilhe com a comunidade.</p><Link href="/publicar" className="btn btn-primary btn-full"><Icon name="plus" size={18}/> Publicar um aviso</Link></div><div className="aside-card aside-tips"><span className="section-kicker">PARTICIPE COM RESPONSABILIDADE</span><h3>Informação que ajuda</h3><ul><li>Descreva o fato com clareza.</li><li>Informe o bairro corretamente.</li><li>Evite divulgar dados pessoais de terceiros.</li><li>Confira a informação antes de publicar.</li></ul></div></aside></section>
    <section className="bottom-banner"><div className="container bottom-content"><div><span className="section-kicker">JUNTOS POR UMA CIDADE MAIS INFORMADA</span><h2>A cidade acontece.<br/>Você fica sabendo.</h2></div><Link href="/cadastrar" className="btn btn-accent">Fazer parte da comunidade <Icon name="arrow" size={20}/></Link></div></section>
  </>;
}
