"use client";

import React, {
   HTMLAttributes,
   ReactNode,
   useEffect,
} from "react";

import { DroppableContext } from "./context";
import { useXandrip } from "../XandripProvider";

export type DroppableProps = Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
   id: string;
   children?: ReactNode;
}

const registry = new Map()

const Droppable = ({ children, id, ...rest }: DroppableProps) => {
   const root = useXandrip()
   useEffect(() => {
      if (registry.has(id)) {
         throw new Error(`Duplicat id: ${id}`);
      }
      registry.set(id, root)
      return () => {
         registry.delete(id)
      }
   }, [id])

   return (
      <DroppableContext.Provider value={{ id, registry }}>
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