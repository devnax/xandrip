import React, { useLayoutEffect } from "react"
import { useDroppable } from "../Droppable";
import { XandState } from "../state";
import useStableState from "../utils/useState";
import { ContainerInfo, DraggableInfo, GetDraggableInfo, WrapperContextValue } from "../Wrapper/types";
import { useWrapper } from "../Wrapper/context";
import animate from "./animate";
import { DraggableProps, StateProps } from "./types";
import { isObject } from "../utils";

const Draggable = ({ id, children, data, ...props }: DraggableProps, ref: any) => {
   const droppable = useDroppable()
   const root: WrapperContextValue = useWrapper() as any
   const containerId = droppable?.id as string
   if (!containerId && !root) throw new Error("Droppable container not found");
   const [getState, setState] = useStableState<StateProps | null>(null)

   const stateValue = (conId: string) => {
      const containers = root.containers()
      const container = containers.get(conId) as ContainerInfo
      const d = container.getDraggable(id) as DraggableInfo
      return {
         draggable: {
            id,
            data,
            element: d.element
         },
         source: {
            id: container.id,
            index: container.getDraggableIndex(id)
         },
         target: getState()?.target
      }
   }

   useLayoutEffect(() => {
      if (containerId) {
         const containers = root.containers()
         for (let con of Array.from(containers.values())) {
            const DroppableProps: Record<string, any> = root.getDroppableProps ? root.getDroppableProps(con.id, stateValue(containerId) as XandState) : {}
            if (Object.keys(DroppableProps || {}).length) {
               for (let prop in DroppableProps) {
                  if (["id", "data-root", " data-droppable", "data-behaviour"].includes(prop)) continue;
                  const v = DroppableProps[prop]
                  if (prop === "style" && isObject(v)) {
                     for (let sk in v) {
                        con.element.style[sk as any] = v[sk]
                     }
                     continue;
                  }
                  con.element.setAttribute(prop, DroppableProps[prop])
               }
            }
         }
      }
   }, [getState()?.target])

   const cleanup = () => {
      const containers = root.containers()
      const { win } = containers.get(containerId) as ContainerInfo
      win.removeEventListener("pointermove", onPointerMove)
      win.removeEventListener("pointerup", onPointerUp)
      win.removeEventListener("pointercancel", onPointerCancel)
      document.body.style.cursor = ""
   }

   const getTargetContainer = (e: any) => {
      const containers = root.containers()
      const container = containers.get(containerId) as ContainerInfo
      const { element } = container.getDraggable(id) as GetDraggableInfo
      const x = e.clientX
      const y = e.clientY
      const state = getState() as StateProps

      const hitContainers = Array.from(containers.values()).filter(con => {
         if (con.isCopy || element?.contains(con.element) || state.placeholder?.clone?.contains(con.element)) return false
         let c = con.iframe || con.element
         const rect = c.getBoundingClientRect()
         let left = rect.left
         let right = rect.right
         let top = rect.top
         let bottom = rect.bottom
         return (x >= left && x <= right && y >= top && y <= bottom)
      })

      const c = hitContainers.sort(
         (a, b) => a.element.getBoundingClientRect().height - b.element.getBoundingClientRect().height
      )[0]

      return c
   }


   const onPointerCancel = () => {
      const containers = root.containers()
      const { element } = containers.get(containerId) as ContainerInfo
      if (!element) return
      cleanup()
   }

   const onPointerUp = (e: any) => {
      const state = getState()
      if (!state || state.stage !== 'move') {
         setState(null)
         cleanup()
         state?.placeholder?.clone?.remove()
         return
      }
      const containers = root.containers()
      const container = containers.get(containerId) as ContainerInfo
      const { element, copied } = container?.getDraggable(id) as GetDraggableInfo
      if (!element) {
         setState(null)
         cleanup()
         state?.placeholder?.clone?.remove()
         return
      }
      try {
         element.releasePointerCapture(e.pointerId)
      } catch { }



      const placeholder = state.placeholder.clone
      const stateval = stateValue(containerId) as XandState

      if (!stateval.target && !container.isCopy) {
         element.after(placeholder)
         placeholder.style.display = 'inherit'
         placeholder.style.visibility = 'hidden'
      }

      root.onRelease && root.onRelease(stateval, e)
      const targetContainer = getTargetContainer(e)
      const elRect = element.getBoundingClientRect()
      let phRect = placeholder.getBoundingClientRect()

      if (copied && (!targetContainer || targetContainer?.id === containerId)) {
         phRect = copied.getBoundingClientRect()
      }

      let left = phRect.left
      let top = phRect.top

      if (targetContainer?.iframe && targetContainer?.id !== containerId) {
         const p = targetContainer.doc.querySelector(`[data-draggable-placeholder="${id}"]`) as HTMLElement
         const framRect = targetContainer.iframe.getBoundingClientRect()
         const pRect = p.getBoundingClientRect()
         left = framRect.left + pRect.left
         top = framRect.top + pRect.top
      }

      const dx = left - elRect.left
      const dy = top - elRect.top
      element.style.transition = `transform .1s cubic-bezier(.22,.61,.36,1)`
      element.style.transform = `translate(${dx}px, ${dy}px)`

      const handleEnd = (ev: TransitionEvent) => {
         if (ev.propertyName !== "transform") return
         element.removeEventListener("transitionend", handleEnd)

         setTimeout(() => {
            placeholder.remove()
            if (stateval.target?.id) {
               const con = containers.get(stateval.target.id) as ContainerInfo
               if (con.iframe && stateval.source.id !== stateval.target.id) {
                  con.doc.querySelector("[data-draggable-placeholder]")?.remove()
               }
            }
         }, 0);

         setTimeout(() => {
            element.style.transition = ""
            element.style.touchAction = ""
            element.style.visibility = ""
            element.style.transform = ""
            element.style.position = ""
            element.style.left = ""
            element.style.top = ""
            element.style.zIndex = ""
            element.style.boxShadow = ""
            element.style.width = ""
            element.style.height = ""
         }, 1);

         setTimeout(() => {
            if (root.onDrop) {
               const isCopy = droppable?.behaviour === 'copy' && droppable.id === stateval.target?.id
               if (!isCopy) {
                  if (!stateval.target && root.onCancel) {
                     root.onCancel(stateval, e)
                  }
                  root.onDrop({
                     // event: state.current?.event,
                     source: {
                        id: stateval.source.id,
                        index: stateval.source.index
                     },
                     target: stateval.target,
                     draggable: {
                        data,
                        element: stateval.draggable.element,
                        id: stateval.draggable.id
                     }
                  }, e)
               }
            }

            setState(null)
         }, 2);
      }
      element.addEventListener("transitionend", handleEnd)
      cleanup()
   }

   const onPointerMove = (e: PointerEvent) => {
      const state = getState() as StateProps
      if (!state?.stage) {
         setState(null)
         cleanup()
         state?.placeholder?.clone?.remove()
         return
      }
      const containers = root.containers()
      const container = containers.get(containerId) as ContainerInfo
      const { element, copied } = container.getDraggable(id) as GetDraggableInfo

      if (!element) {
         setState(null)
         cleanup()
         return
      }

      let targetContainer = getTargetContainer(e)

      if (state?.stage === "ready") {
         e.preventDefault()
         element.setPointerCapture(e.pointerId)

         const placeholderMain = container.doc.querySelector(`[data-draggable-placeholder="${id}"]`) as HTMLElement
         const placeholder = placeholderMain?.cloneNode(true) as HTMLElement
         placeholder.style.display = 'inherit'

         const rect = element.getBoundingClientRect()
         document.body.style.cursor = "grabbing"
         if (copied) {
            copied.style.display = "block"
         } else if (placeholder) {
            placeholderMain.after(placeholder)
         }

         const oldWidth = rect.width;
         const oldHeight = rect.height;

         element.style.position = "fixed"
         element.style.zIndex = "1000"
         element.style.left = `${rect.left}px`
         element.style.top = `${rect.top}px`
         element.style.width = rect.width + "px"
         element.style.height = rect.height + "px"
         element.draggable = false
         element.style.touchAction = "none"
         element.style.visibility = "hidden"

         // element.style.boxShadow = "0 12px 28px rgba(0,0,0,0.18),  0 2px 8px rgba(0,0,0,0.10)"
         // element.style.transform = "scale(1.05)"
         // element.style.transition = "box-shadow 180ms ease, transform 180ms ease"

         // if (root.renderActiveItem && root.renderActiveItem(_state)) {
         //    element.style.visibility = "hidden"
         // }

         if (root.onStart) {
            root.onStart(stateValue(containerId) as XandState, e)
         }

         if (root.renderActiveItem && root.renderActiveItem(stateValue(containerId) as XandState)) {
            setTimeout(() => {
               let firstRect = (element.firstElementChild as any).getBoundingClientRect()
               element.style.width = firstRect.width + "px"
               element.style.height = firstRect.height + "px"

               const rect = element.getBoundingClientRect()
               const newWidth = rect.width;
               const newHeight = rect.height;

               // cursor position inside element
               const clickX = e.clientX - rect.left;
               const clickY = e.clientY - rect.top;

               const ratioX = clickX / oldWidth;
               const ratioY = clickY / oldHeight;

               // 🔥 anchor to cursor
               const newLeft = e.clientX - ratioX * newWidth;
               const newTop = e.clientY - ratioY * newHeight;

               if (oldWidth !== newWidth) {
                  element.style.left = `${newLeft}px`
                  state.offset.x = e.clientX - newLeft;
               }
               if (oldHeight !== newHeight) {
                  element.style.top = `${newTop}px`
                  state.offset.y = e.clientY - newTop;
               }
               setState(p => p)
               element.style.visibility = "visible"
            }, 1);
         } else {
            element.style.visibility = "visible"
         }

         setState(p => ({
            ...p as StateProps,
            stage: "move",
            placeholder: {
               main: placeholderMain,
               clone: placeholder
            }
         }))
         return
      } else {
         element.style.left = `${e.clientX - state?.offset?.x}px`
         element.style.top = `${e.clientY - state?.offset?.y}px`
      }

      const placeholder = state.placeholder.clone
      placeholder.innerHTML = state.placeholder.main.innerHTML
      placeholder.style.display = 'none'

      if (targetContainer) {
         if (!targetContainer.isCopy) {
            placeholder.style.display = 'inherit'
            const draggables = targetContainer.getDraggables()
            const childs = draggables.filter(d => d.element !== element)
            let index = childs.length
            for (let i = 0; i < childs.length; i++) {
               const rect = childs[i].element.getBoundingClientRect()
               const midY = rect.top + (rect.height / 2)
               if (e.clientY < midY) {
                  index = i
                  break;
               }
            }

            const isAnimation = (root.sortingAnimation ?? true)
            const play = isAnimation ? animate(childs.map(c => c.element)) : null

            let draggable = childs[index]
            if (draggable) {
               draggable.element.before(placeholder)
            } else {
               draggable = childs[childs.length - 1]
               if (draggable) {
                  draggable.element.after(placeholder)
               } else {
                  targetContainer.element.insertBefore(placeholder, null)
               }
            }

            const prevTargetContainer = state.target?.id ? containers.get(state.target?.id) : null
            if (play && prevTargetContainer?.id === targetContainer.id) {
               play()
            }
            setState(p => ({
               ...p as StateProps,
               target: {
                  id: targetContainer.id,
                  index
               }
            }))
         } else {
            const s = stateValue(containerId) as XandState
            setState(p => ({
               ...p as StateProps,
               target: {
                  id: targetContainer.id,
                  index: s.source.index
               }
            }))
         }
      } else {
         placeholder.style.display = 'none'
         setState(p => ({
            ...p as StateProps,
            target: null
         }))
      }

      root.onMove && root.onMove(stateValue(containerId) as XandState, e)
   }
   const state = getState()
   const isStarted = state?.stage && state.stage !== 'ready'
   const renderItem: any = root?.renderActiveItem
   const renderPlaceholder: any = root?.renderPlaceholder
   const AProps = isStarted && root.getActiveItemProps ? root.getActiveItemProps(stateValue(containerId) as XandState) : {}
   const PProps = isStarted && root.getPlaceholderProps ? root.getPlaceholderProps(stateValue(containerId) as XandState) : {}

   return (<>
      <div
         ref={ref}
         {...props}
         {...AProps}
         data-draggable={id}
         onPointerDown={(e: any) => {
            if (!containerId) throw new Error("Droppable container not found");
            const containers = root.containers()
            const _container = containers.get(containerId) as ContainerInfo
            const stateval = stateValue(containerId) as XandState

            if (root.getHandler && !root.getHandler({
               ...stateval,
               target: {
                  id: containerId,
                  index: _container.getDraggableIndex(id)
               }
            }, e)) {
               return
            }

            const { element } = _container.getDraggable(id) as unknown as DraggableInfo
            const rect = element.getBoundingClientRect()
            const state = {
               target: {
                  id: containerId,
                  index: _container.getDraggableIndex(id)
               },
               offset: {
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top
               },
               stage: "ready"
            }

            e.stopPropagation()

            setState(state as StateProps)
            root.onReady && root.onReady(stateval, e)
            _container.win.addEventListener("pointermove", onPointerMove)
            _container.win.addEventListener("pointerup", onPointerUp)
            _container.win.addEventListener("pointercancel", onPointerCancel)
         }}
      >
         {isStarted ? (renderItem ? (renderItem(stateValue(containerId)) || children) : children) : children}
      </div>
      {state && <>
         {
            droppable?.isCopy && <div
               {...props}
               {...AProps}
               data-draggable-copy={id}
               style={{
                  display: "none"
               }}
            >
               {children}
            </div>
         }
         <div
            {...props}
            {...PProps}
            data-draggable-placeholder={id}
            style={{
               opacity: .5,
               pointerEvents: "none",
               cursor: "none",
               ...props?.style,
               ...(PProps as any)?.style,
               display: "none"
            }}
         >
            {renderPlaceholder ? (renderPlaceholder(stateValue(containerId)) || children) : children}
         </div>
      </>}
   </>)
}

export default React.forwardRef(Draggable)