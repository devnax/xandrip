"use client";
import React, { forwardRef, HTMLAttributes, ReactNode, useEffect } from "react";
import { DroppableContext } from "./context";

export type DroppableProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "id" | "data"
> & {
  id: string;
  data?: Record<string, any>;
  children?: ReactNode;
};

export const droppableRegistry = new Map();

const Droppable = (
  { children, id, data, ...rest }: DroppableProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  useEffect(() => {
    if (droppableRegistry.has(id)) {
      throw new Error(`Duplicat id: ${id}`);
    }
    droppableRegistry.set(id, { id, data });
    return () => {
      droppableRegistry.delete(id);
    };
  }, [id]);

  return (
    <DroppableContext.Provider
      value={{ id, data, registry: droppableRegistry }}
    >
      <div {...rest} ref={ref} data-xan-droppable={id}>
        {children}
      </div>
    </DroppableContext.Provider>
  );
};

export default forwardRef(Droppable);
