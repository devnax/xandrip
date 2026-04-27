import React, { HTMLProps, ReactElement, createContext, useContext } from "react";
import { Iframe } from "@xanui/core";
import { useWrapper } from "../Wrapper/context";
import { DraggableProps } from "../Draggable/types";

export type DroppableContextValue = {
   id: string | null;
   behaviour: "copy" | "normal";
   isCopy: boolean
}

const Context = createContext<DroppableContextValue | null>(null)
export const useDroppable = () => useContext(Context)

export type DroppableProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children"> & {
   id: string;
   box?: "normal" | "iframe"
   behaviour?: "normal" | "copy";
   children: ReactElement<DraggableProps>[]
}


const Droppable = ({ children, id, behaviour, box, ...props }: DroppableProps, ref: any) => {
   const root = useWrapper()
   if (!root) throw new Error("Root provider not found");
   box ??= "normal"
   behaviour ??= "normal"

   return (
      <Context.Provider value={{ id, behaviour, isCopy: behaviour === 'copy' }}>
         {
            box === 'iframe' ? <Iframe
               data-droppable={id}
               data-root={root.id}
               data-behaviour={behaviour === "copy" ? "copy" : "normal"}
               style={{
                  border: "1px dashed",
                  height: 500,
                  width: "100%"
               }}
            >
               <div
                  ref={ref}
                  {...props}
                  data-droppable={id}
                  data-root={root.id}
                  data-behaviour={behaviour === "copy" ? "copy" : "normal"}
               >
                  {children}
               </div>
            </Iframe> : <div
               ref={ref}
               {...props}
               data-droppable={id}
               data-root={root.id}
               data-behaviour={behaviour === "copy" ? "copy" : "normal"}
            >
               {children}
            </div>
         }
      </Context.Provider>
   )
}

export default React.forwardRef(Droppable)