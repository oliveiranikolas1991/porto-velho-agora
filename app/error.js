'use client';
export default function ErrorPage({ reset }) {
  return <div className="empty-state not-found container"><h1>Não foi possível carregar esta página</h1><p>Ocorreu um erro inesperado. Tente novamente.</p><button onClick={() => reset()} className="btn btn-primary">Tentar novamente</button></div>;
}
