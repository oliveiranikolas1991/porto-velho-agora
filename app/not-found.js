import Link from 'next/link';
export default function NotFound() {
  return <div className="empty-state not-found container"><strong>404</strong><h1>Não encontramos essa página</h1><p>O endereço pode ter mudado ou o aviso pode não estar mais disponível.</p><Link href="/" className="btn btn-primary">Voltar ao início</Link></div>;
}
