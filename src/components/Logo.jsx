export default function Logo({ size = 36 }) {
  return (
    <img
      src="/logo2.png"
      alt="AIDATARIS"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  )
}
