"use client"
import React, { HTMLProps, useId, ReactNode } from "react";
import { XandripRootContext } from "./context";
import { StartDragProps } from "../Draggable/startDrag";


export type XandripRootProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children" | "onDrop"> & {
   children: ReactNode
} & StartDragProps


const XandripRoot = ({ children, style, onReady, onStart, onMove, onDrop, canCopy, canDrop, canDrag, renderPlaceholder, renderActiveItem, getActiveItemProps, getPlaceholderProps, getActiveDroppableProps, disableAnimation, ...props }: XandripRootProps) => {
   const id = useId()
   const s: any = { id }
   if (onReady) s.onReady = onReady
   if (onStart) s.onStart = onStart
   if (onMove) s.onMove = onMove
   if (onDrop) s.onDrop = onDrop
   if (canCopy) s.canCopy = canCopy
   if (canDrop) s.canDrop = canDrop
   if (canDrag) s.canDrag = canDrag
   if (renderPlaceholder) s.renderPlaceholder = renderPlaceholder
   if (renderActiveItem) s.renderActiveItem = renderActiveItem
   if (getActiveItemProps) s.getActiveItemProps = getActiveItemProps
   if (getPlaceholderProps) s.getPlaceholderProps = getPlaceholderProps
   if (getActiveDroppableProps) s.getActiveDroppableProps = getActiveDroppableProps
   if (disableAnimation) s.disableAnimation = disableAnimation

   return (
      <XandripRootContext.Provider
         value={s}
      >
         <div
            id={id}
            style={style}
         >
            {children}
         </div>
      </XandripRootContext.Provider>
   )
}

export default XandripRoot