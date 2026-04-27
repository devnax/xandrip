import React, { HTMLProps, ReactNode } from 'react'
import { useWrapper } from '../Wrapper/context'
import startDrag from '../include/startDrag'
import { useDroppable } from '../Droppable/context'

export type DraggableProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children"> & {
   id: string
   children: ReactNode;
}

const Draggable = ({ children, id, ...rest }: DraggableProps) => {
   const wrapper = useWrapper()
   const droppable = useDroppable()

   return (
      <div
         {...rest}
         id={id}
         data-droppable={droppable.id}
         onPointerDown={(e) => {
            startDrag(e as any, id, wrapper)
         }}
      >
         {children}
      </div>
   )
}

export default Draggable
