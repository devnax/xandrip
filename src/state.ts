
export type XandDroppableId = string
export type XandDraggableId = string;

export type XandStateSource = {
   id: XandDroppableId;
   index: number;
}

export type XandStateTarget = {
   id: XandDraggableId;
   index: number;
}

export type XandState = {
   // event: React.PointerEvent<HTMLElement>;
   source: XandStateSource,
   target: XandStateTarget | null;
   draggable: {
      id: XandDraggableId;
      element: HTMLElement;
      data?: Record<string, any>
   }
}