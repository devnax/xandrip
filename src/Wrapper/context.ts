import { createContext, useContext } from "react"
import { WrapperContextValue } from "./types"

export const WrapperContext = createContext<WrapperContextValue | null>(null)
export const useWrapper = () => useContext(WrapperContext)