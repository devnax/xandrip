"use client";

import React, {
   HTMLAttributes,
   ReactNode,
} from "react";

import { useXandripRoot } from "../XandripRoot/context";
import { DroppableContext } from "./context";
import { StartDragProps } from "../Draggable/startDrag";

export type DroppableProps = Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
   id: string;
   children?: ReactNode;
} & StartDragProps

const Droppable = ({ children, id, onReady, onStart, onMove, onDrop, canCopy, canDrop, canDrag, renderPlaceholder, renderActiveItem, getActiveItemProps, getPlaceholderProps, getActiveDroppableProps, disableAnimation, ...rest }: DroppableProps) => {
   const wrapper = useXandripRoot();
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
      <DroppableContext.Provider value={s}>
         <div
            {...rest}
            id={id}
            data-wrapper={wrapper.id}
         >
            {children}
         </div>
      </DroppableContext.Provider>
   );
};

export default Droppable;