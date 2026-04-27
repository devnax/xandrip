import React, { HTMLProps, useId, ReactNode } from "react";
import { WrapperContext } from "./context";
import { StartDragProps } from "../include/startDrag";


export type WrapperProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children"> & {
   children: ReactNode
} & StartDragProps




const Wrapper = ({ children, style, onReady, onStart, onMove, onDrop, canCopy, getHandler, renderPlaceholder, renderActiveItem, getActiveItemProps, getPlaceholderProps, getDroppableProps, getAcceptContainer, ...props }: WrapperProps) => {
   const id = useId()
   const s: StartDragProps = {}
   if (onReady) s.onReady = onReady
   if (onStart) s.onStart = onStart
   if (onMove) s.onMove = onMove
   if (onDrop) s.onDrop = onDrop
   if (canCopy) s.canCopy = canCopy
   if (getHandler) s.getHandler = getHandler
   if (renderPlaceholder) s.renderPlaceholder = renderPlaceholder
   if (renderActiveItem) s.renderActiveItem = renderActiveItem
   if (getActiveItemProps) s.getActiveItemProps = getActiveItemProps
   if (getDroppableProps) s.getDroppableProps = getDroppableProps
   if (getAcceptContainer) s.getAcceptContainer = getAcceptContainer

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