import { HTMLProps } from "react";

export const getWrapper = (wrapperId: string) => {
   const wrapper = document.getElementById(wrapperId)
   if (!wrapper) throw new Error("Invalid Wrapper id");
   return wrapper
}

export const getDroppables = (wrapperId: string) => {
   const droppables: any = document.querySelectorAll(`[data-wrapper="${wrapperId}"]`)
   return [...droppables] as HTMLElement[]
}

export const getDroppable = (droppableId: string) => {
   const droppable = document.getElementById(droppableId)
   if (!droppable) throw new Error(`Invalid droppable ID: ${droppableId}`);
   return droppable
}

export const getDraggables = (droppableId: string) => {
   const droppable: any = getDroppable(droppableId)
   return [...droppable.children] as HTMLElement[]
}

export const getDraggable = (draggableId: string) => {
   const draggalbe = document.getElementById(draggableId)
   if (!draggalbe) throw new Error("Invalid draggable id");
   return draggalbe
}




export const applyElementProps = (element: HTMLElement, props: HTMLProps<HTMLDivElement>) => {
   Object.entries(props).forEach(([key, value]) => {

      if (value == null || ["id", "data-droppable", "data-draggable", "data-wrapper"].includes(key)) return;

      // style object
      if (key === "style" && typeof value === "object") {
         Object.assign(element.style, value);
         return;
      }

      // className
      if (key === "className") {
         element.classList.remove(value)
         element.classList.add(value)
         return;
      }

      // events
      if (key.startsWith("on") && typeof value === "function") {
         const eventName = key.slice(2).toLowerCase();
         element.addEventListener(eventName, value as EventListener);
         return;
      }

      // attributes
      element.setAttribute(key, String(value));
   });
};