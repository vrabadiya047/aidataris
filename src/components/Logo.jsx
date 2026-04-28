import { useTheme } from '../ThemeContext'

export default function Logo({ size = 36 }) {
  const { theme } = useTheme()
  return (
    <img
      src={theme === 'dark' ? '/logo2.png' : '/logo.png'}
      alt="AIDATARIS"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  )
}
