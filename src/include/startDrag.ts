import { HTMLProps, ReactElement, ReactNode } from "react";
import {
   getDraggable,
   getDraggables,
   getDroppable,
   getDroppables,
   getWrapper,
} from "./elements";
import animate from "./animate";

export type StateProps = {
   source: {
      id: string,
      index: number;
   }
   target: null | {
      id: string,
      index: number;
   }
}

export type StartDragProps = {
   onReady?: (state: StateProps, event: PointerEvent) => void;
   onStart?: (state: StateProps, event: PointerEvent) => void;
   onMove?: (state: StateProps, event: PointerEvent) => void;
   onDrop?: (state: StateProps, event: PointerEvent) => void;
   canCopy?: (state: StateProps, event: PointerEvent) => boolean;

   getHandler?: (state: StateProps, event: PointerEvent) => boolean
   renderPlaceholder?: (state: StateProps) => ReactElement<HTMLProps<HTMLElement>> | void;
   renderActiveItem?: (state: StateProps) => ReactElement<HTMLProps<HTMLElement>> | void;
   getActiveItemProps?: (state: StateProps) => HTMLProps<HTMLDivElement>
   getPlaceholderProps?: (state: StateProps) => HTMLProps<HTMLDivElement>
   getDroppableProps?: (id: string, state?: StateProps) => HTMLProps<HTMLDivElement>;
   getAcceptContainer?: (state: StateProps) => boolean
   sortingAnimation?: boolean;
};

const startDrag = (event: PointerEvent, draggableId: string, props?: StartDragProps) => {
   event.stopPropagation()
   const draggable = getDraggable(draggableId);

   const droppableId = draggable.dataset.droppable!;
   const droppable = getDroppable(droppableId);

   const wrapperId = droppable.dataset.wrapper!;
   const wrapper = getWrapper(wrapperId);

   const droppables = getDroppables(wrapperId);
   const draggables = getDraggables(droppableId)
   const currentIndex = draggables.findIndex(d => d === draggable)
   const state: StateProps = {
      source: {
         id: droppableId,
         index: currentIndex,
      },
      target: {
         id: droppableId,
         index: currentIndex,
      },
   }
   const isSourceCopy = props?.canCopy ? props?.canCopy(state, event) : false
   const rect = draggable.getBoundingClientRect();

   const offsetX = event.clientX - rect.left;
   const offsetY = event.clientY - rect.top;

   const clone = draggable.cloneNode(true) as HTMLElement;
   const placeholder = draggable.cloneNode(true) as HTMLElement;

   clone.removeAttribute("id")
   clone.removeAttribute("data-droppable")
   clone.removeAttribute("style")

   placeholder.removeAttribute("id")
   placeholder.removeAttribute("data-droppable")
   placeholder.removeAttribute("style")


   // ---- placeholder styling (IMPORTANT)
   placeholder.style.display = `none`;
   placeholder.style.height = `${rect.height}px`;
   placeholder.style.width = `${rect.width}px`;
   placeholder.style.opacity = `.3`;

   draggable.after(placeholder);
   wrapper.style.userSelect = "none";

   // ---- clone styling
   clone.style.position = "fixed";
   clone.style.height = `${rect.height}px`;
   clone.style.width = `${rect.width}px`;
   clone.style.top = "0px";
   clone.style.left = "0px";
   clone.style.pointerEvents = "none";
   clone.style.willChange = "transform";
   clone.style.zIndex = "999999";

   if (props?.onReady) {
      props.onReady(state, event)
   }

   const Move = (e: PointerEvent) => {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      if (!wrapper.contains(clone)) {
         wrapper.appendChild(clone);
         if (props?.onStart) {
            props.onStart(state, e)
         }
      }


      clone.style.transform = `translate(${x}px, ${y}px) translateZ(0)`;

      // hide original
      if (!isSourceCopy) {
         draggable.style.display = "none";
         placeholder.style.display = `block`;
      } else {
         if (state.target && state.source.id !== state.target?.id) {
            placeholder.style.display = `block`;
         }
      }

      // detect container under cursor
      const container = droppables.filter((con) => {
         const isTargetCopy = props?.canCopy ? props?.canCopy({
            source: {
               id: con.id,
               index: 0
            },
            target: null
         }, e) : false

         if (isTargetCopy || draggable?.contains(con) || placeholder?.contains(con)) return false

         const r = con.getBoundingClientRect();
         return (
            e.clientX >= r.left &&
            e.clientX <= r.right &&
            e.clientY >= r.top &&
            e.clientY <= r.bottom
         );
      }).sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];

      if (!container) {
         state.target = null
         if (props?.onMove) {
            props.onMove(state, e)
         }
         return
      };

      const targetConId = container.id;
      const targetDroppables = getDraggables(targetConId)
      const items = targetDroppables.filter((el) => el !== draggable && el !== placeholder);

      const rects = items.map(el => el.getBoundingClientRect());
      const isList = rects.every(r => Math.abs(r.left - rects[0].left) < 5);

      let insertIndex = items.length;
      const THRESHOLD = 6;

      for (let i = 0; i < items.length; i++) {
         const r = items[i].getBoundingClientRect();
         if (isList) {
            const midY = r.top + r.height / 2;
            if (e.clientY < midY - THRESHOLD) {
               insertIndex = i;
               break;
            }
         } else {
            if (e.clientY < r.top) {
               insertIndex = i;
               break;
            }
            const midX = r.left + r.width / 2;
            const isSameRow = e.clientY >= r.top && e.clientY <= r.bottom;

            if (isSameRow && e.clientX < midX - THRESHOLD) {
               insertIndex = i;
               break;
            }
         }
      }

      const refNode = items[insertIndex];
      if (placeholder.nextElementSibling !== refNode || placeholder.parentElement !== container) {
         const play = animate(items)
         if (refNode) {
            container.insertBefore(placeholder, refNode);
         } else {
            container.appendChild(placeholder);
         }
         play()
      }

      const finalIndex = targetDroppables.filter((el) => el !== draggable).findIndex(d => d === placeholder)
      state.target = {
         id: targetConId,
         index: finalIndex
      }
      if (props?.onMove) {
         props.onMove(state, e)
      }
   };

   const Up = (e: PointerEvent) => {
      if (props?.onDrop) {
         props.onDrop(state, e)
      }

      document.removeEventListener("pointermove", Move);
      document.removeEventListener("pointerup", Up);
      draggable.style.removeProperty("display");
      clone.remove();
      placeholder.remove();
      wrapper.style.removeProperty("user-select");
   };

   document.addEventListener("pointermove", Move);
   document.addEventListener("pointerup", Up);
};

export default startDrag;