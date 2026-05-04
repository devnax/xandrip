"use client"
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

export type XandripState = {
   data: any,
   draggable: {
      id: string;
   },
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
   onReady?: (state: XandripState, event: PointerEvent) => void;
   onStart?: (state: XandripState, event: PointerEvent) => void;
   onMove?: (state: XandripState, event: PointerEvent) => void;
   onDrop?: (state: XandripState, event: PointerEvent) => void;
   canCopy?: (state: XandripState, event: PointerEvent) => boolean;
   canDrag?: (state: XandripState, event: PointerEvent) => boolean;
   canDrop?: (state: XandripState, event: PointerEvent) => boolean;

   renderPlaceholder?: (state: XandripState, event: PointerEvent) => ReactElement<HTMLProps<HTMLElement>> | void;
   renderActiveItem?: (state: XandripState, event: PointerEvent) => ReactElement<HTMLProps<HTMLElement>> | void;
   getActiveItemProps?: (state: XandripState, event: PointerEvent) => HTMLProps<HTMLDivElement> | void
   getPlaceholderProps?: (state: XandripState, event: PointerEvent) => HTMLProps<HTMLDivElement> | void
   getActiveDroppableProps?: (state: XandripState, event: PointerEvent) => HTMLProps<HTMLDivElement> | void

   disableAnimation?: (state: XandripState, event: PointerEvent) => boolean
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
   const state: XandripState = {
      data,
      draggable: {
         id: draggableId
      },
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
      const key =
         `${state.source.id}:${state.source.index}|` +
         `${state.target?.id ?? ""}:${state.target?.index ?? -1}`;
      if (key === prevKey) return;
      prevKey = key;

      if (props?.renderPlaceholder) {
         const pdom = props.renderPlaceholder(state, e)
         if (pdom) {
            placeholderRoot.render(pdom);
         }
      }

      if (props?.renderActiveItem) {
         const activedom = props.renderActiveItem(state, e) as ReactNode
         if (activedom) {
            cloneRoot.render(activedom);
         }
      }

      if (props?.getPlaceholderProps) {
         const pprops = props.getPlaceholderProps(state, e)
         if (pprops) {
            applyElementProps(
               placeholder,
               pprops
            );
         }
      }

      if (props?.getActiveItemProps) {
         const aprops = props.getActiveItemProps(state, e)
         if (aprops) {
            applyElementProps(
               clone,
               aprops
            );
         }
      }
   };

   renderDragElements(event)

   wrapper.style.userSelect = "none";
   placeholder.style.display = `none`;
   placeholder.style.opacity = `.3`;

   clone.style.position = "fixed";
   clone.style.top = `${rect.top}px`;
   clone.style.left = `${rect.left}px`;
   clone.style.width = `${rect.width}px`;
   clone.style.height = `${rect.height}px`;
   clone.style.margin = "0";
   clone.style.pointerEvents = "none";
   clone.style.willChange = "transform";
   clone.style.zIndex = "999999";
   clone.style.visibility = "hidden";

   draggable.after(placeholder);
   wrapper.appendChild(clone);

   if (props?.renderActiveItem && props?.renderActiveItem(state, event)) {
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
         clone.style.visibility = "visible";

         if (props?.onStart) {
            props.onStart(state, e)
         }
      }

      const x = e.clientX - offsetX - rect.left;
      const y = e.clientY - offsetY - rect.top;

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
         if (draggable?.contains(con) || placeholder?.contains(con)) return false

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
            const dprops = props?.getActiveDroppableProps({
               ...state,
               target: null
            }, e)
            if (dprops) {
               applyElementProps(td, dprops)
            }
         }
      }

      if (!container) {
         state.target = null
         placeholder.style.display = "none"
         renderDragElements(e)
         if (props?.onMove) {
            props.onMove(state, e)
         }
         return
      };


      if (props?.canCopy) {
         const isTargetCopy = props?.canCopy({
            data,
            draggable: {
               id: draggableId
            },
            source: {
               id: container.id,
               index: 0
            },
            target: null
         }, e)

         if (isTargetCopy) {
            placeholder.style.display = "none"
            return
         }
      }

      if (props?.canDrop) {
         const is = props?.canDrop({
            ...state,
            target: {
               id: container.id,
               index: 0
            }
         }, e)
         if (!is) {
            state.target = null;
            placeholder.style.display = "none";
            return;
         }
      }

      if (props?.getActiveDroppableProps) {
         const dprops = props?.getActiveDroppableProps(state, e)
         if (dprops) {
            applyElementProps(container, dprops)
         }
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
         const firstRects = new Map<HTMLElement, DOMRect>();

         if (props?.disableAnimation && !props.disableAnimation(state, e)) {
            items.forEach((el) => {
               firstRects.set(el, el.getBoundingClientRect());
            });
         }


         if (refNode) {
            container.insertBefore(placeholder, refNode);
         } else {
            container.appendChild(placeholder);
         }
         if (props?.disableAnimation && !props.disableAnimation(state, e)) {
            items.forEach((el) => {
               const first = firstRects.get(el);
               if (!first) return;
               const last = el.getBoundingClientRect();
               const dx = first.left - last.left;
               const dy = first.top - last.top;

               if (!dx && !dy) return;

               el.style.transition = "none";
               el.style.transform = `translate(${dx}px, ${dy}px)`;
               requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                     el.style.transition = "transform 250ms cubic-bezier(.22,.61,.36,1)";
                     el.style.transform = "";
                  });
               });
            });
         }
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

      document.removeEventListener("pointermove", Move);
      document.removeEventListener("pointerup", Up);
      document.removeEventListener("pointercancel", Up);

      let targetX = 0;
      let targetY = 0;

      if (state.target) {
         const finalRect = placeholder.getBoundingClientRect();
         targetX = finalRect.left - rect.left;
         targetY = finalRect.top - rect.top;
      } else {
         targetX = 0;
         targetY = 0;
      }

      clone.style.transition = "transform 180ms cubic-bezier(.2,.8,.2,1)";
      clone.style.transform = `translate(${targetX}px, ${targetY}px)`;

      const finish = () => {
         clone.removeEventListener("transitionend", finish);
         setTimeout(() => {
            cleanup(e);
         }, 50)
      };

      clone.addEventListener("transitionend", finish);
   };

   const cleanup = (e: PointerEvent) => {
      if (props?.onDrop && state.target) {
         props.onDrop(state, e)
      }

      if (props?.getActiveDroppableProps) {
         if (state.target) {
            const td = getDroppable(state.target.id)
            const dprops = props?.getActiveDroppableProps({
               ...state,
               target: null
            }, e)
            if (dprops) {
               applyElementProps(td, dprops)
            }
         }
      }

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