export default function BlokinhoAvatar({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19" fill="var(--color-lime)" />
      <circle cx="20" cy="20" r="19" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      <circle cx="13.5" cy="17.5" r="2.6" fill="#0a0a0a" />
      <circle cx="26.5" cy="17.5" r="2.6" fill="#0a0a0a" />
      <path
        d="M12.5 24.5c3 3.4 12 3.4 15 0"
        stroke="#0a0a0a"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 10c1.5-2.5 4.5-4 7-3"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
