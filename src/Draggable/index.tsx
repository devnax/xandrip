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
  children?: ReactNode;
  data?: any;
  render?: (args: {
    ref: React.Ref<HTMLDivElement>;
    props: {
      onPointerDown: React.PointerEventHandler;
      "data-xan-droppable-id": string;
      "data-xan-draggable": string;
    } & HTMLProps<HTMLDivElement>;
  }) => ReactNode;
};
const Draggable = (
  { children, id, data, render, ...rest }: DraggableProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  if (!render && !children) {
    throw new Error(`Children required`);
  }

  const droppable = useDroppable();
  const root = useXandrip();

  const dragProps = {
    ...rest,
    ref,
    "data-xan-droppable-id": droppable.id,
    "data-xan-draggable": id,
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      startDrag(e as any, id, data, { ...root });
    },
  };

  if (render) {
    return render({
      ref,
      props: dragProps,
    });
  }

  return <div {...dragProps}>{children}</div>;
};

export default forwardRef(Draggable);
