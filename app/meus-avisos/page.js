import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '../../lib/session';
import { listMyAvisos } from '../../lib/avisos';
import AvisoCard from '../../components/AvisoCard';
import { Icon } from '../../components/Icons';
export const metadata = { title: 'Meus avisos' };
export const dynamic = 'force-dynamic';
export default async function MeusAvisos() {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  const avisos = await listMyAvisos(user.id);
  return <section className="my-page container"><div className="page-header-row"><div><span className="section-kicker">MINHA PARTICIPAÇÃO</span><h1>Meus avisos</h1><p>Olá, {user.nome}. Aqui estão suas contribuições para a comunidade.</p></div><Link href="/publicar" className="btn btn-primary"><Icon name="plus" size={18}/> Novo aviso</Link></div>{avisos.length ? <div className="notice-grid">{avisos.map(a=><AvisoCard key={a.id} aviso={a}/>)}</div> : <div className="empty-state"><Icon name="message" size={42}/><h2>Você ainda não publicou avisos</h2><p>Compartilhe a primeira informação com os moradores da cidade.</p><Link href="/publicar" className="btn btn-primary">Publicar aviso</Link></div>}</section>;
}
