import React, { createContext, ReactNode, useContext } from "react"
import { StartDragProps } from "../Draggable/startDrag"

export type XandripContextValue = StartDragProps
export const XandripContext = createContext<XandripContextValue | null>(null)

export const useXandrip = () => {
   const ctx = useContext(XandripContext)
   // if (!ctx) throw new Error("useXandrip must be used within a XandripProvider");
   return ctx
}


export type XandripProviderProps = StartDragProps & {
   children: ReactNode
}

export const XandripProvider = ({ children, ...props }: XandripProviderProps) => {
   return (
      <XandripContext.Provider value={props}>
         {children}
      </XandripContext.Provider>
   )
}