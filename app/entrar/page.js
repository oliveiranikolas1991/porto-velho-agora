import Link from 'next/link';
import AuthForm from '../../components/AuthForm';
import { Icon } from '../../components/Icons';
export const metadata = { title: 'Entrar' };
export default async function Entrar({ searchParams }) {
  const { cadastro } = await searchParams;
  return <section className="auth-page container"><div className="auth-info"><span className="section-kicker">BEM-VINDO DE VOLTA</span><h1>Sua cidade está<br/><em>contando com você.</em></h1><p>Entre para publicar avisos e fazer parte da rede de informação da nossa cidade.</p><div className="auth-benefit"><Icon name="shield"/> Seu acesso é protegido e gratuito.</div></div><div className="auth-card"><div className="auth-card-heading"><span className="eyebrow-dark">ACESSO À COMUNIDADE</span><h2>Entrar na conta</h2><p>Continue de onde você parou.</p></div>{cadastro === 'ok' && <div className="success-alert" role="status">Conta criada! Entre com seu e-mail e senha.</div>}<AuthForm mode="login"/><Link href="/" className="back-link">← Voltar para os avisos</Link></div></section>;
}
