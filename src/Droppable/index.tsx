"use client";

import React, {
   HTMLAttributes,
   ReactNode,
} from "react";

import { DroppableContext } from "./context";

export type DroppableProps = Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
   id: string;
   children?: ReactNode;
}

const Droppable = ({ children, id, ...rest }: DroppableProps) => {
   return (
      <DroppableContext.Provider value={{ id }}>
         <div
            {...rest}
            data-xan-droppable={id}
         >
            {children}
         </div>
      </DroppableContext.Provider>
   );
};

export default Droppable;