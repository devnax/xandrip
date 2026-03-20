import { HTMLProps, ReactElement, ReactNode } from "react";
import { XandState } from "../state";

export type WrapperProps = {
   children: ReactNode;
   onReady?: (state: XandState, event: PointerEvent) => void;
   onStart?: (state: XandState, event: PointerEvent) => void;
   onMove?: (state: XandState, event: PointerEvent) => void;
   onRelease?: (state: XandState, event: PointerEvent) => void;
   onDrop?: (state: XandState, event: PointerEvent) => void;
   onCancel?: (state: XandState, event: PointerEvent) => void;
   getHandler?: (state: XandState, event: PointerEvent) => boolean
   renderPlaceholder?: (state: XandState) => ReactElement<HTMLProps<HTMLElement>> | void;
   renderActiveItem?: (state: XandState) => ReactElement<HTMLProps<HTMLElement>> | void;
   getActiveItemProps?: (state: XandState) => HTMLProps<HTMLDivElement>
   getPlaceholderProps?: (state: XandState) => HTMLProps<HTMLDivElement>
   getDroppableProps?: (id: string, state?: XandState) => HTMLProps<HTMLDivElement>;
   getAcceptContainer?: (state: XandState) => boolean
   sortingAnimation?: boolean;
}


export type WrapperContextValue = Omit<WrapperProps, "children"> & { id: string, containers: () => Map<string, ContainerInfo> }

export type DraggableInfo = {
   id: string;
   element: HTMLElement;
}

export type GetDraggableInfo = {
   id: string;
   element: HTMLElement;
   copied: HTMLElement | null;
}

export type ContainerInfo = {
   element: HTMLElement,
   iframe: HTMLElement | null;
   id: string,
   doc: Document;
   win: Window
   isCopy: boolean;
   getDraggables: () => DraggableInfo[];
   getDraggable: (draggableId: string) => DraggableInfo | void
   getDraggableIndex: (draggableId: string) => number;
}