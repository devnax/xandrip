import React, { HTMLProps, ReactNode } from 'react'
import { useWrapper } from '../Wrapper/context'
import startDrag from '../include/startDrag'
import { useDroppable } from '../Droppable/context'

export type DraggableProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children"> & {
   id: string
   children: ReactNode;
   data?: any
}

const Draggable = ({ children, id, data, ...rest }: DraggableProps) => {
   const wrapper = useWrapper()
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
