import React, { HTMLProps, ReactElement } from 'react'
import { DraggableProps } from '../Draggable'
import { useWrapper } from '../Wrapper/context'
import { DroppableContext } from './context'

export type DroppableProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children"> & {
   id: string
   children: ReactElement<DraggableProps>[] | ReactElement<DraggableProps>
}

const Droppable = ({ children, id, ...rest }: DroppableProps) => {
   const wrapper = useWrapper()

   return (
      <DroppableContext.Provider
         value={{ id }}
      >
         <div {...rest} data-wrapper={wrapper.id} id={id}>
            {children}
         </div>
      </DroppableContext.Provider>
   )
}

export default Droppable
