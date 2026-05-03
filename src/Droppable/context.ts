import { createContext, useContext } from "react"
import { StartDragProps } from "../Draggable/startDrag"

export type DroppableContextValue = {
   id: string
} & StartDragProps

export const DroppableContext = createContext<DroppableContextValue | null>(null)
export const useDroppable = () => {
   const ctx = useContext(DroppableContext)
   if (!ctx) throw new Error("Invalid droppable context");
   return ctx
}