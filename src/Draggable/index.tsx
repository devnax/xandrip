"use client";
import React, { forwardRef, HTMLProps, ReactNode } from "react";
import startDrag from "./startDrag";
import { useDroppable } from "../Droppable/context";
import { useXandrip } from "../XandripProvider";

export type DraggableProps = Omit<
  HTMLProps<HTMLDivElement>,
  "id" | "data" | "children" | "onPointerDown"
> & {
  id: string;
  children: ReactNode;
  data?: any;
};

const Draggable = (
  { children, id, data, ...rest }: DraggableProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const droppable = useDroppable();
  const root = useXandrip();

  return (
    <div
      {...rest}
      ref={ref}
      data-xan-droppable-id={droppable.id}
      data-xan-draggable={id}
      onPointerDown={(e) => {
        startDrag(e as any, id, data, { ...root });
      }}
    >
      {children}
    </div>
  );
};

export default forwardRef(Draggable);
