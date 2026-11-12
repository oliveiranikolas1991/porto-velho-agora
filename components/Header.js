import Link from 'next/link';
import BrandMark from './BrandMark';
import LogoutButton from './LogoutButton';
import { Icon } from './Icons';

export default function Header({ user }) {
  return <header className="site-header">
    <div className="container header-content">
      <Link className="brand" href="/" aria-label="Porto Velho Agora — início">
        <BrandMark />
        <span className="brand-text"><strong>Porto Velho</strong><em>AGORA<span className="brand-period">.</span></em></span>
      </Link>
      <nav className="nav-links" aria-label="Navegação principal">
        <Link href="/" className="nav-link">Explorar avisos</Link>
        {user ? <><Link href="/meus-avisos" className="nav-link">Meus avisos</Link><LogoutButton /></> : <><Link href="/entrar" className="nav-link">Entrar</Link><Link href="/cadastrar" className="nav-link register-link">Criar conta</Link></>}
        {user && <Link href="/publicar" className="btn btn-primary nav-publish"><Icon name="plus" size={17}/> Publicar aviso</Link>}
      </nav>
    </div>
  </header>;
}
