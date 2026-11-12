import Link from 'next/link';
import AuthForm from '../../components/AuthForm';
import { Icon } from '../../components/Icons';
export const metadata = { title: 'Criar conta' };
export default function Cadastro() {
  return <section className="auth-page container"><div className="auth-info"><span className="section-kicker">SUA VOZ FAZ A DIFERENÇA</span><h1>Uma cidade melhor<br/><em>começa com você.</em></h1><p>Crie sua conta gratuita, publique avisos úteis e ajude a manter Porto Velho informada.</p><div className="auth-benefit"><Icon name="shield"/> Sem custos. Sua senha fica protegida.</div></div><div className="auth-card"><div className="auth-card-heading"><span className="eyebrow-dark">JUNTE-SE À COMUNIDADE</span><h2>Criar minha conta</h2><p>Leva menos de um minuto para começar.</p></div><AuthForm mode="signup"/><Link href="/" className="back-link">← Voltar para os avisos</Link></div></section>;
}
