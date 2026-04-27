import { HTMLProps, ReactNode } from "react";

export type DraggableProps = Omit<HTMLProps<HTMLDivElement>, "id" | "data" | "children"> & {
   id: string;
   children: ReactNode;
   data?: Record<string, any>;
}


export type StateProps = {
   target: {
      id: string;
      index: number;
   } | null
   offset: {
      x: number,
      y: number
   },
   stage: "ready" | "start" | "move" | "drop" | null;
   placeholder: {
      main: HTMLElement,
      clone: HTMLElement
   }
}
