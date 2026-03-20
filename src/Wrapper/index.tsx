import React, { useId } from "react";
import { ContainerInfo, WrapperProps, DraggableInfo } from "./types";
import { WrapperContext } from "./context";

const Wrapper = ({ children, ...props }: WrapperProps) => {
   const id = useId()

   const containers = () => {
      const items: Map<string, ContainerInfo> = new Map()
      const containers = Array.from(document.querySelectorAll(`[data-root=${id}]`)) as HTMLElement[]
      for (let container of containers) {
         const isIframe = container.tagName === "IFRAME"

         if (isIframe) {
            const doc = (container as any).contentDocument!
            const droppables = doc.querySelectorAll(`[data-root=${id}]`)
            for (let dopcon of droppables) {
               const conid = dopcon.getAttribute('data-droppable') as string
               const info = {
                  id: conid,
                  element: dopcon,
                  iframe: container,
                  win: (container as any).contentWindow!,
                  doc,
                  isCopy: !!dopcon.closest('[data-behaviour="copy"]'),
                  getDraggables: () => {
                     const children = Array.from(dopcon.children) as HTMLElement[]
                     const childs: DraggableInfo[] = []
                     if (children) {
                        for (let c of children) {
                           const id = c.getAttribute('data-draggable') as string
                           const cid = c.getAttribute('data-draggable-copy')
                           const pid = c.getAttribute('data-draggable-placeholder')
                           if (!id || cid || pid) continue;
                           childs.push({
                              id,
                              element: c,
                           })
                        }
                     }
                     return childs
                  },
                  getDraggable: (draggableId: string) => {
                     const ele = dopcon.querySelector(`[data-draggable="${draggableId}"]`)
                     if (ele) {
                        const p = doc.querySelector(`[data-draggable-placeholder="${draggableId}"]`) as HTMLElement
                        const c = doc.querySelector(`[data-draggable-copy="${draggableId}"]`) as HTMLElement
                        return {
                           id: draggableId,
                           element: ele,
                           placeholder: p,
                           copied: c || null,
                        }
                     }
                  },
                  getDraggableIndex: (draggableId: string) => {
                     const draggables = info.getDraggables()
                     return draggables.findIndex(i => i.id === draggableId)
                  }
               }
               items.set(conid, info)
            }
         } else {
            const conid = container.getAttribute('data-droppable') as string
            const info = {
               id: conid,
               element: container as HTMLElement,
               iframe: null,
               win: window,
               doc: document,
               isCopy: !!container.closest('[data-behaviour="copy"]'),
               getDraggables: () => {
                  const children = Array.from(container.children) as HTMLElement[]
                  const childs: DraggableInfo[] = []
                  if (children) {
                     for (let c of children) {
                        const id = c.getAttribute('data-draggable') as string
                        const cid = c.getAttribute('data-draggable-copy')
                        const pid = c.getAttribute('data-draggable-placeholder')
                        if (!id || cid || pid) continue;
                        childs.push({
                           id,
                           element: c,
                        })
                     }
                  }
                  return childs
               },
               getDraggable: (draggableId: string) => {
                  const ele = container.querySelector(`[data-draggable="${draggableId}"]`)
                  if (ele) {
                     const c = document.querySelector(`[data-draggable-copy="${draggableId}"]`) as HTMLElement
                     return {
                        id: draggableId,
                        element: ele,
                        copied: c || null,
                     }
                  }
               },
               getDraggableIndex: (draggableId: string) => {
                  const draggables = info.getDraggables()
                  return draggables.findIndex(i => i.id === draggableId)
               }
            }
            items.set(conid, info as any)
         }
      }
      return items
   }

   return (
      <WrapperContext.Provider
         value={{
            ...props,
            id,
            containers
         }}
      >
         {children}
      </WrapperContext.Provider>
   )
}

export default Wrapper