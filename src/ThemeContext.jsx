import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => (typeof window !== 'undefined' && localStorage.getItem('aidataris-theme')) || 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('aidataris-theme', theme)
  }, [theme])

  return (
    <Ctx.Provider value={{ theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      {children}
    </Ctx.Provider>
  )
}

export const useTheme = () => useContext(Ctx)
