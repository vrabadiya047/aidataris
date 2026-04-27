export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="#06B6D4" />
      <rect x="7"  y="7"  width="8" height="8" fill="white"   rx="1.5" />
      <rect x="16" y="7"  width="8" height="8" fill="#0284C7" rx="1.5" />
      <rect x="25" y="7"  width="8" height="8" fill="white"   rx="1.5" />
      <rect x="7"  y="16" width="8" height="8" fill="#0284C7" rx="1.5" />
      <rect x="16" y="16" width="8" height="8" fill="white"   rx="1.5" />
      <rect x="25" y="16" width="8" height="8" fill="#0284C7" rx="1.5" />
      <rect x="7"  y="25" width="8" height="8" fill="white"   rx="1.5" />
      <rect x="16" y="25" width="8" height="8" fill="#0284C7" rx="1.5" />
      <rect x="25" y="25" width="8" height="8" fill="white"   rx="1.5" />
    </svg>
  )
}
