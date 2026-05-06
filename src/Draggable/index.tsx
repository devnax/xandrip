"use client"
import React, { HTMLProps, ReactNode } from 'react'
import startDrag from './startDrag'
import { useDroppable } from '../Droppable/context'

export type DraggableProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children" | "onPointerDown"> & {
   id: string
   children: ReactNode;
   data?: any
}

const Draggable = ({ children, id, data, ...rest }: DraggableProps) => {
   const droppable = useDroppable()

   return (
      <div
         {...rest}
         data-xan-droppable-id={droppable.id}
         data-xan-draggable={id}
         onPointerDown={(e) => {
            startDrag(e as any, id, data, {
               onDrop(state, event) {
                  const { onDrop } = droppable.registry.get(state.target?.id as string) || {}
                  if (onDrop) {
                     onDrop(state, event)
                  }
               },
               onReady: (state, event) => {
                  const { onReady } = droppable.registry.get(state.source.id) || {}
                  if (onReady) {
                     onReady(state, event)
                  }
               },
               onStart: (state, event) => {
                  const { onStart } = droppable.registry.get(state.source.id) || {}
                  if (onStart) {
                     onStart(state, event)
                  }
               },
               onMove: (state, event) => {
                  const { onMove } = droppable.registry.get(state.target?.id as string) || {}
                  if (onMove) {
                     onMove(state, event)
                  }
               },
               canCopy: (state, event) => {
                  const { canCopy } = droppable.registry.get(state.source.id) || {}
                  if (canCopy) {
                     return canCopy(state, event)
                  }
                  return false
               },
               canDrag: (state, event) => {
                  const { canDrag } = droppable.registry.get(state.source.id) || {}
                  if (canDrag) {
                     return canDrag(state, event)
                  }
                  return true
               },
               canDrop: (state, event) => {
                  const { canDrop } = droppable.registry.get(state.target?.id as string) || {}
                  if (canDrop) {
                     return canDrop(state, event)
                  }
                  return true
               },

               renderPlaceholder: (state, event) => {
                  const { renderPlaceholder } = droppable.registry.get(state.target?.id as string) || {}
                  if (renderPlaceholder) {
                     return renderPlaceholder(state, event)
                  }
               },
               renderActiveItem: (state, event) => {
                  const { renderActiveItem } = droppable.registry.get(state.target?.id as string) || {}
                  if (renderActiveItem) {
                     return renderActiveItem(state, event)
                  }
               },
               getActiveItemProps: (state, event) => {
                  const { getActiveItemProps } = droppable.registry.get(state.target?.id as string) || {}
                  if (getActiveItemProps) {
                     return getActiveItemProps(state, event)
                  }
               },
               getPlaceholderProps: (state, event) => {
                  const { getPlaceholderProps } = droppable.registry.get(state.target?.id as string) || {}
                  if (getPlaceholderProps) {
                     return getPlaceholderProps(state, event)
                  }
               },
               getActiveDroppableProps: (state, event) => {
                  const { getActiveDroppableProps } = droppable.registry.get(state.target?.id as string) || {}
                  if (getActiveDroppableProps) {
                     return getActiveDroppableProps(state, event)
                  }
               },

               disableAnimation: (state, event) => {
                  const { disableAnimation } = droppable.registry.get(state.target?.id as string) || {}
                  if (disableAnimation) {
                     return disableAnimation(state, event)
                  }
                  return false
               },
            })
         }}
      >
         {children}
      </div>
   )
}

export default Draggable
