"use client"
import React, { HTMLProps, ReactNode } from 'react'
import { useXandripRoot } from '../XandripRoot/context'
import startDrag from './startDrag'
import { useDroppable } from '../Droppable/context'

export type DraggableProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children"> & {
   id: string
   children?: ReactNode;
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
            startDrag(e as any, id, data, wrapper)
         }}
      >
         {children}
      </div>
   )
}

export default Draggable
