import { createContext, useContext } from "react"
import { XandripContextValue } from "../XandripProvider"

export type DroppableContextValue = {
   id: string
   registry: Map<string, XandripContextValue>
}

export const DroppableContext = createContext<DroppableContextValue | null>(null)
export const useDroppable = () => {
   const ctx = useContext(DroppableContext)
   if (!ctx) throw new Error("Invalid droppable context");
   return ctx
}