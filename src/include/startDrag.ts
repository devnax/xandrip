import { HTMLProps, ReactElement, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
   applyElementProps,
   getDraggable,
   getDraggables,
   getDroppable,
   getDroppables,
   getWrapper,
} from "./elements";
import animate from "./animate";

export type StateProps = {
   data: any,
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
   canDrag?: (state: StateProps, event: PointerEvent) => boolean;

   renderPlaceholder?: (state: StateProps, event: PointerEvent) => ReactElement<HTMLProps<HTMLElement>> | void;
   renderActiveItem?: (state: StateProps, event: PointerEvent) => ReactElement<HTMLProps<HTMLElement>> | void;
   getActiveItemProps?: (state: StateProps, event: PointerEvent) => HTMLProps<HTMLDivElement>
   getPlaceholderProps?: (state: StateProps, event: PointerEvent) => HTMLProps<HTMLDivElement>
   getActiveDroppableProps?: (state: StateProps, event: PointerEvent) => HTMLProps<HTMLDivElement>

   disableAnimation?: boolean;
};

const startDrag = (event: PointerEvent, draggableId: string, data?: any, props?: StartDragProps) => {
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
      data,
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
   if (isSourceCopy) {
      state.target = null
   }
   if (props?.canDrag && !props?.canDrag(state, event)) {
      return
   }
   const rect = draggable.getBoundingClientRect();

   const grabX = (event.clientX - rect.left) / rect.width;
   const grabY = (event.clientY - rect.top) / rect.height;

   let offsetX = event.clientX - rect.left;
   let offsetY = event.clientY - rect.top;

   const clone = draggable.cloneNode(true) as HTMLElement;
   const placeholder = draggable.cloneNode(true) as HTMLElement;
   const cloneRoot = createRoot(clone)
   const placeholderRoot = createRoot(placeholder)

   clone.removeAttribute("id")
   clone.removeAttribute("data-droppable")
   clone.removeAttribute("style")

   placeholder.removeAttribute("id")
   placeholder.removeAttribute("data-droppable")
   placeholder.removeAttribute("style")

   let prevKey = "";
   const renderDragElements = (e: PointerEvent) => {
      const key = JSON.stringify(state);
      if (key === prevKey) return;
      prevKey = key;

      if (props?.renderPlaceholder) {
         placeholderRoot.render(
            props.renderPlaceholder(state, e) as ReactNode
         );
      }

      if (props?.renderActiveItem) {
         cloneRoot.render(
            props.renderActiveItem(state, e) as ReactNode
         );
      }

      if (props?.getPlaceholderProps) {
         applyElementProps(
            placeholder,
            props.getPlaceholderProps(state, e)
         );
      }

      if (props?.getActiveItemProps) {
         applyElementProps(
            clone,
            props.getActiveItemProps(state, e)
         );
      }
   };

   renderDragElements(event)

   wrapper.style.userSelect = "none";
   placeholder.style.display = `none`;
   placeholder.style.opacity = `.3`;

   clone.style.visibility = "hidden";
   clone.style.position = "fixed";
   clone.style.top = "0px";
   clone.style.left = "0px";
   clone.style.pointerEvents = "none";
   clone.style.willChange = "transform";
   clone.style.zIndex = "999999";

   draggable.after(placeholder);
   wrapper.appendChild(clone);

   if (props?.renderActiveItem) {
      const cloneRect = clone.getBoundingClientRect();
      offsetX = cloneRect.width * grabX;
      offsetY = cloneRect.height * grabY;
   }

   if (props?.onReady) {
      props.onReady(state, event)
   }

   const Move = (e: PointerEvent) => {
      if (clone.style.visibility === 'hidden') {
         const cloneRect = clone.getBoundingClientRect();
         offsetX = cloneRect.width * grabX;
         offsetY = cloneRect.height * grabY;

         requestAnimationFrame(() => {
            clone.style.visibility = "visible";
         })

         if (props?.onStart) {
            props.onStart(state, e)
         }
      }

      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      clone.style.transform = `translate(${x}px, ${y}px)`;

      // hide original
      if (!isSourceCopy) {
         draggable.style.display = "none";
         placeholder.style.display = `block`;
      } else {
         if (state.target && state.source.id !== state.target?.id) {
            placeholder.style.display = `block`;
         }
      }


      const container = droppables.filter((con) => {
         const isTargetCopy = props?.canCopy ? props?.canCopy({
            data,
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

      if (props?.getActiveDroppableProps) {
         if (state.target) {
            const td = getDroppable(state.target.id)
            applyElementProps(td, props?.getActiveDroppableProps({
               ...state,
               target: null
            }, e))
         }
      }

      if (!container) {
         state.target = null
         renderDragElements(e)
         if (props?.onMove) {
            props.onMove(state, e)
         }
         return
      };

      if (props?.getActiveDroppableProps) {
         applyElementProps(container, props?.getActiveDroppableProps(state, e))
      }

      const targetConId = container.id;
      const targetDraggables = getDraggables(targetConId)
      const items = targetDraggables.filter((el) => el !== draggable && el !== placeholder);

      const rects = items.map(el => el.getBoundingClientRect());
      const isList = rects.every(r => Math.abs(r.left - rects[0].left) < 5);

      let insertIndex = items.length;
      const THRESHOLD = 6;

      for (let i = 0; i < items.length; i++) {
         const r = items[i].getBoundingClientRect()
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
         const play = !props?.disableAnimation ? animate(items) : null
         if (refNode) {
            container.insertBefore(placeholder, refNode);
         } else {
            container.appendChild(placeholder);
         }
         play && play()
      }

      const finalIndex = targetDraggables.filter((el) => el !== draggable).findIndex(d => d === placeholder)
      state.target = {
         id: targetConId,
         index: finalIndex
      }
      renderDragElements(e);
      if (props?.onMove) {
         props.onMove(state, e)
      }
   };

   const Up = (e: PointerEvent) => {
      if (props?.onDrop && state.target) {
         props.onDrop(state, e)
      }

      if (props?.getActiveDroppableProps) {
         if (state.target) {
            const td = getDroppable(state.target.id)
            applyElementProps(td, props?.getActiveDroppableProps({
               ...state,
               target: null
            }, e))
         }
      }

      document.removeEventListener("pointermove", Move);
      document.removeEventListener("pointerup", Up);
      draggable.style.removeProperty("display");
      cloneRoot.unmount();
      placeholderRoot.unmount();

      clone.remove();
      placeholder.remove();
      wrapper.style.removeProperty("user-select");
      (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
   };

   (event.target as HTMLElement).setPointerCapture(event.pointerId);
   document.addEventListener("pointermove", Move);
   document.addEventListener("pointerup", Up);
   document.addEventListener("pointercancel", Up);
};

export default startDrag;