export function Icon({ name, size = 20, stroke = 1.8, ...props }) {
  const shared = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', ...props };
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3-6 8-6s8 2 8 6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    shield: <><path d="M12 2 4 5v6c0 5.4 3 9 8 11 5-2 8-5.6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></>,
    filter: <><path d="M4 7h16M7 12h10M10 17h4"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 16-5-5-9 10"/></>,
    message: <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l2.3-3.8A8.5 8.5 0 1 1 21 11.5Z"/></>,
    chevron: <><path d="m9 18 6-6-6-6"/></>,
    rain: <><path d="M20 16a4 4 0 0 0-2.5-7.3 6 6 0 0 0-11.5 2A4 4 0 0 0 6 18"/><path d="m10 16-2 4M16 16l-2 4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
    alert: <><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5M12 17h.01"/></>,
    market: <><path d="M3 10h18l-2-6H5l-2 6Z"/><path d="M5 10v11h14V10M9 21v-7h6v7"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
  };
  return <svg {...shared}>{paths[name] || paths.info}</svg>;
}
export const ICON_BY_CATEGORY = { Feiras: 'market', Buracos: 'alert', Chuvas: 'rain', Eventos: 'calendar', Outros: 'message' };
