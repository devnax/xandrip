"use client"
import React, { HTMLProps, ReactNode } from 'react'
import { useXandripRoot } from '../XandripRoot/context'
import startDrag, { StartDragProps } from './startDrag'
import { useDroppable } from '../Droppable/context'

export type DraggableProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children" | "onPointerDown"> & {
   id: string
   children: ReactNode;
   data?: any
}

const Draggable = ({ children, id, data, ...rest }: DraggableProps) => {
   const wrapper = useXandripRoot()
   const droppable = useDroppable()

   return (
      <div
         {...rest}
         id={id}
         data-droppable={droppable.id}
         onPointerDown={(e) => {

            startDrag(e as any, id, data, {
               ...wrapper,
               onReady: (state, event) => {
                  if (droppable.onReady && state.source.id === droppable.id) {
                     droppable.onReady(state, event)
                  } else if (wrapper.onReady) {
                     wrapper.onReady(state, event)
                  }
               },
               onStart: (state, event) => {
                  if (droppable.onStart && state.source.id === droppable.id) {
                     droppable.onStart(state, event)
                  } else if (wrapper.onStart) {
                     wrapper.onStart(state, event)
                  }
               },
               onMove: (state, event) => {
                  if (droppable.onMove && state.source.id === droppable.id) {
                     droppable.onMove(state, event)
                  } else if (wrapper.onMove) {
                     wrapper.onMove(state, event)
                  }
               },
               onDrop: (state, event) => {
                  if (droppable.onDrop && state.target?.id === droppable.id) {
                     droppable.onDrop(state, event)
                  } else if (wrapper.onDrop) {
                     wrapper.onDrop(state, event)
                  }
               },
               canCopy: (state, event) => {
                  if (droppable.canCopy && state.source?.id === droppable.id) {
                     return droppable.canCopy(state, event)
                  } else if (wrapper.canCopy) {
                     return wrapper.canCopy(state, event)
                  }
                  return false
               },
               canDrop: (state, event) => {
                  if (droppable.canDrop && state.target?.id === droppable.id) {
                     return droppable.canDrop(state, event)
                  } else if (wrapper.canDrop) {
                     return wrapper.canDrop(state, event)
                  }
                  return true
               },
               canDrag: (state, event) => {
                  if (droppable.canDrag && state.source?.id === droppable.id) {
                     return droppable.canDrag(state, event)
                  } else if (wrapper.canDrag) {
                     return wrapper.canDrag(state, event)
                  }
                  return true
               },
               renderPlaceholder: (state, event) => {
                  if (droppable.renderPlaceholder && state.target?.id === droppable.id) {
                     return droppable.renderPlaceholder(state, event)
                  } else if (wrapper.renderPlaceholder) {
                     return wrapper.renderPlaceholder(state, event)
                  }
               },
               renderActiveItem: (state, event) => {
                  if (droppable.renderActiveItem && state.source.id === droppable.id) {
                     return droppable.renderActiveItem(state, event)
                  } else if (wrapper.renderActiveItem) {
                     return wrapper.renderActiveItem(state, event)
                  }
               },
               getActiveItemProps: (state, event) => {
                  if (droppable.getActiveItemProps && state.source.id === droppable.id) {
                     return droppable.getActiveItemProps(state, event)
                  } else if (wrapper.getActiveItemProps) {
                     return wrapper.getActiveItemProps(state, event)
                  }
               },
               getPlaceholderProps: (state, event) => {
                  if (droppable.getPlaceholderProps && state.target?.id === droppable.id) {
                     return droppable.getPlaceholderProps(state, event)
                  } else if (wrapper.getPlaceholderProps) {
                     return wrapper.getPlaceholderProps(state, event)
                  }
               },
               getActiveDroppableProps: (state, event) => {
                  if (droppable.getActiveDroppableProps && state.target?.id === droppable.id) {
                     return droppable.getActiveDroppableProps(state, event)
                  } else if (wrapper.getActiveDroppableProps) {
                     return wrapper.getActiveDroppableProps(state, event)
                  }
               },
               disableAnimation: (state, event) => {
                  if (droppable.disableAnimation && state.target?.id === droppable.id) {
                     return droppable.disableAnimation(state, event)
                  } else if (wrapper.disableAnimation) {
                     return wrapper.disableAnimation(state, event)
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
