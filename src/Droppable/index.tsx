"use client";

import React, {
   HTMLAttributes,
   ReactNode,
} from "react";

import { useXandripRoot } from "../XandripRoot/context";
import { DroppableContext } from "./context";

export type DroppableProps = Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
   id: string;
   children?: ReactNode;
};

const Droppable = ({ children, id, ...rest }: DroppableProps) => {
   const wrapper = useXandripRoot();

   return (
      <DroppableContext.Provider value={{ id }}>
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