interface MineIconProps {
  className?: string;
  lit?: boolean;
}

/**
 * A small hand-drawn bomb glyph (body, highlight, cap, and a spark on the
 * fuse) rather than a generic icon-font bomb, so it reads as part of this
 * game's own visual language.
 */
export function MineIcon({ className = '', lit = false }: MineIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="16" cy="18" r="10" fill="currentColor" />
      <circle cx="12.5" cy="14.5" r="2.4" fill="white" fillOpacity="0.25" />
      <path d="M16 8V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 5c1.8-1.6 3.6-1.6 4.6-0.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="21" cy="4" r="1.8" fill={lit ? '#FDBA0C' : 'currentColor'} />
    </svg>
  );
}
