import { ReactElement } from "react";
import { getDraggable, getDroppable, getWrapper } from "./elements";

export type StartDragProps = {
   renderActiveItem?: ReactElement
}

const startDrag = (event: PointerEvent, draggableId: string, props?: StartDragProps) => {
   const draggable = getDraggable(draggableId);

   const droppableId = draggable.dataset.droppable!;
   const droppable = getDroppable(droppableId);

   const wrapperId = droppable.dataset.wrapper!;
   const wrapper = getWrapper(wrapperId);

   const rect = draggable.getBoundingClientRect();

   const offsetX = event.clientX - rect.left;
   const offsetY = event.clientY - rect.top;
   const startX = event.clientX - offsetX;
   const startY = event.clientY - offsetY;

   const clone = draggable.cloneNode(true) as HTMLElement;
   const placeholder = draggable.cloneNode(true) as HTMLElement;
   clone.style.position = 'fixed';
   clone.style.top = '0px';
   clone.style.left = '0px';
   clone.style.pointerEvents = 'none';
   clone.style.willChange = 'transform';
   clone.style.zIndex = '999999';
   clone.style.transform = `translate(${startX}px, ${startY}px) translateZ(0)`;

   wrapper.appendChild(clone);

   const Move = (e: PointerEvent) => {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      clone.style.transform = `translate(${x}px, ${y}px) translateZ(0)`;

      draggable.style.display = "none";
   };

   const Up = () => {
      document.removeEventListener("pointermove", Move);
      document.removeEventListener("pointerup", Up);

      draggable.style.removeProperty("display");
      clone?.remove();
   };

   document.addEventListener("pointermove", Move);
   document.addEventListener("pointerup", Up);
};

export default startDrag