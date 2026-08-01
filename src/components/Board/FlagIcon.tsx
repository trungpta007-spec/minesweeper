interface FlagIconProps {
  className?: string;
}

/** A simple pennant-on-a-pole glyph, drawn so the pole planting animates cleanly from the base. */
export function FlagIcon({ className = '' }: FlagIconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 27V6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M10 6.5c3-1.8 5.6-1.8 8-0.4 2.2 1.3 4.4 1.3 6.4 0.1v9.4c-2 1.2-4.2 1.2-6.4-0.1-2.4-1.4-5-1.4-8 0.4V6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
