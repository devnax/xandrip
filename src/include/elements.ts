
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
