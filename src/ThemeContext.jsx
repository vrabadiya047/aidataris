import { createContext, useContext } from 'react'

const Ctx = createContext({})

export function ThemeProvider({ children }) {
  return <Ctx.Provider value={{}}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
