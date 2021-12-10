import { createContext, useContext } from 'react'

export const ScreenCtx = createContext({})

export const useScreenCtx = () => useContext(ScreenCtx)
