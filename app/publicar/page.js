import Link from 'next/link';
import { redirect } from 'next/navigation';
import NewAvisoForm from '../../components/NewAvisoForm';
import { Icon } from '../../components/Icons';
import { currentUser } from '../../lib/session';
export const metadata = { title: 'Publicar aviso' };
export const dynamic = 'force-dynamic';
export default async function Publicar() {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  return <section className="form-page container"><div className="breadcrumb"><Link href="/">Início</Link><Icon name="chevron" size={15}/> Publicar aviso</div><div className="form-page-header"><span className="section-kicker">SUA INFORMAÇÃO IMPORTA</span><h1>Compartilhe um aviso</h1><p>Ajude outras pessoas a saberem o que acontece em Porto Velho.</p></div><div className="form-layout"><div className="form-panel"><NewAvisoForm/></div><aside className="form-tips"><span className="aside-icon"><Icon name="info" size={25}/></span><h3>Antes de publicar</h3><p>Seu aviso será exibido publicamente assim que for enviado. Seja claro e responsável.</p><ul><li>Conte apenas fatos que você conhece.</li><li>Não exponha informações pessoais.</li><li>Fotos devem representar o acontecimento.</li></ul></aside></div></section>;
}
