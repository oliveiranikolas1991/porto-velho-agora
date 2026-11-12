import './globals.css';
import Link from 'next/link';
import Header from '../components/Header';
import BrandMark from '../components/BrandMark';
import { currentUser } from '../lib/session';

export const metadata = {
  title: { default: 'Porto Velho Agora | Informação que conecta', template: '%s | Porto Velho Agora' },
  description: 'Avisos da comunidade de Porto Velho: feiras, trânsito, chuvas, eventos e informações úteis. A cidade acontece. Você fica sabendo.',
};

export default async function RootLayout({ children }) {
  const user = await currentUser();
  return <html lang="pt-BR"><body>
    <div className="app-shell"><Header user={user}/><main id="conteudo">{children}</main>
      <footer className="footer"><div className="container footer-content"><div className="footer-brand"><BrandMark small/><span><strong>Porto Velho Agora</strong><small>A cidade acontece. Você fica sabendo.</small></span></div><span>Feito para conectar nossa comunidade. <Link href="/">Voltar ao início</Link></span></div></footer>
    </div>
  </body></html>;
}
