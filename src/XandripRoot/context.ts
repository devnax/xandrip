import { createContext, useContext } from "react"
import { StartDragProps } from "../Draggable/startDrag"

export type XandripRootValue = { id: string } & StartDragProps

export const XandripRootContext = createContext<XandripRootValue | null>(null)
export const useXandripRoot = () => {
   const ctx = useContext(XandripRootContext)
   if (!ctx) throw new Error("Invalid Wrapper");
   return ctx
}