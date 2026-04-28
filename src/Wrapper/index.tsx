import React, { HTMLProps, useId, ReactNode } from "react";
import { WrapperContext } from "./context";
import { StartDragProps } from "../include/startDrag";


export type WrapperProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children" | "onDrop"> & {
   children: ReactNode
} & StartDragProps




const Wrapper = ({ children, style, onReady, onStart, onMove, onDrop, canCopy, canDrag, renderPlaceholder, renderActiveItem, getActiveItemProps, getPlaceholderProps, getActiveDroppableProps, disableAnimation, ...props }: WrapperProps) => {
   const id = useId()
   const s: StartDragProps = {}
   if (onReady) s.onReady = onReady
   if (onStart) s.onStart = onStart
   if (onMove) s.onMove = onMove
   if (onDrop) s.onDrop = onDrop
   if (canCopy) s.canCopy = canCopy
   if (canDrag) s.canDrag = canDrag
   if (renderPlaceholder) s.renderPlaceholder = renderPlaceholder
   if (renderActiveItem) s.renderActiveItem = renderActiveItem
   if (getActiveItemProps) s.getActiveItemProps = getActiveItemProps
   if (getPlaceholderProps) s.getPlaceholderProps = getPlaceholderProps
   if (getActiveDroppableProps) s.getActiveDroppableProps = getActiveDroppableProps
   if (disableAnimation) s.disableAnimation = disableAnimation

   return (
      <WrapperContext.Provider
         value={{
            id,
            ...s
         }}
      >
         <div
            id={id}
            style={style}
         >
            {children}
         </div>
      </WrapperContext.Provider>
   )
}

export default Wrapper