export default function BrandMark({ small = false }) {
  return (
    <span className={`brand-mark ${small ? 'brand-mark-small' : ''}`} aria-hidden="true">
      <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
        <path d="M5.5 24.5L16.5 7L27.5 24.5H5.5Z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round"/>
        <path d="M11 21H22" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
        <circle cx="16.5" cy="15.8" r="2.1" fill="currentColor"/>
        <path d="M8.5 28H24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </span>
  );
}
