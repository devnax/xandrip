import React, { useId } from "react";
import { ContainerInfo, WrapperProps, DraggableInfo } from "./types";
import { WrapperContext } from "./context";

const Wrapper = ({ children, ...props }: WrapperProps) => {
   const id = useId()
   return (
      <WrapperContext.Provider
         value={{
            ...props,
            id,
         }}
      >
         <div
            id={id}
         >
            {children}
         </div>
      </WrapperContext.Provider>
   )
}

export default Wrapper