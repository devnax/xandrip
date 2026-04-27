import { createContext, useContext } from "react"
import { StartDragProps } from "../include/startDrag"

export type WrapperContextValue = { id: string } & StartDragProps

export const WrapperContext = createContext<WrapperContextValue | null>(null)
export const useWrapper = () => {
   const ctx = useContext(WrapperContext)
   if (!ctx) throw new Error("Invalid Wrapper");
   return ctx
}