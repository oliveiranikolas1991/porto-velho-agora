export function formatDate(date) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      timeZone: 'America/Porto_Velho'
    }).format(new Date(date));
  } catch { return 'Data indisponível'; }
}

export function summarize(value, max = 145) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}
