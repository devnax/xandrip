"use client";
import React, { forwardRef, HTMLAttributes, ReactNode, useEffect } from "react";
import { DroppableContext } from "./context";

export type DroppableProps = Omit<
  HTMLAttributes<HTMLElement>,
  "id" | "data"
> & {
  id: string;
  data?: any;
  children?: ReactNode;

  render?: (args: {
    ref: React.Ref<HTMLElement>;
    props: {
      "data-xan-droppable": string;
    } & HTMLAttributes<HTMLElement>;
  }) => ReactNode;
};

export const droppableRegistry = new Map();
const Droppable = (
  { children, id, data, render, ...rest }: DroppableProps,
  ref: React.ForwardedRef<HTMLElement>,
) => {
  useEffect(() => {
    if (droppableRegistry.has(id)) {
      throw new Error(`Duplicat id: ${id}`);
    }
    droppableRegistry.set(id, { id, data });
    return () => {
      droppableRegistry.delete(id);
    };
  }, [id, data]);

  const contextValue = {
    id,
    data,
    registry: droppableRegistry,
  };

  const droppableProps = {
    ...rest,
    ref,
    "data-xan-droppable": id,
  };

  return (
    <DroppableContext.Provider value={contextValue}>
      {render ? (
        render({ ref, props: droppableProps })
      ) : (
        <div {...(droppableProps as any)}>{children}</div>
      )}
    </DroppableContext.Provider>
  );
};

export default forwardRef(Droppable);
