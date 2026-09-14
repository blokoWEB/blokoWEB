const ICON_ASPECT = 202 / 278;

export default function BlokinhoAvatar({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 202 278"
      width={size * ICON_ASPECT}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M201.15,11.64v53.31H14.89c-8.23,0-14.89-6.67-14.89-14.89V11.64C0,5.21,7.62,0,17.03,0h167.09c9.41,0,17.03,5.21,17.03,11.64Z"
        fill="#3058a4"
      />
      <circle cx="178.03" cy="23.84" r="8.64" fill="var(--color-lime)" />
      <rect y="76.18" width="94.96" height="94.97" rx="19.01" ry="19.01" fill="#3058a4" />
      <rect x="106.19" y="76.18" width="94.95" height="94.97" rx="19.01" ry="19.01" fill="#3058a4" />
      <rect x="106.19" y="182.38" width="94.96" height="94.96" rx="19.01" ry="19.01" fill="#3058a4" />
      <path
        d="M44.89,277.34c-12.31,0-22.92-4.27-31.81-12.81-7.66-7.35-12.02-16.11-13.08-26.27v-10.09c1.06-10.17,5.42-18.92,13.08-26.27,8.89-8.54,19.5-12.81,31.81-12.81h44.78v44.12c0,12.34-4.39,22.78-13.16,31.32-8.77,8.54-19.31,12.81-31.62,12.81Z"
        fill="var(--color-lime)"
      />
    </svg>
  );
}
