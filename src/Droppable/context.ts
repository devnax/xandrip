import { createContext, useContext } from "react"

export type DroppableContextValue = {
   id: string
}

export const DroppableContext = createContext<DroppableContextValue | null>(null)
export const useDroppable = () => {
   const ctx = useContext(DroppableContext)
   if (!ctx) throw new Error("Invalid droppable context");
   return ctx
}