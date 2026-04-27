const animate = (elements: HTMLElement[]) => {
   const first = new Map<HTMLElement, DOMRect>()

   elements.forEach(el => {
      first.set(el, el.getBoundingClientRect())
   })

   return () => {
      document.body.getBoundingClientRect()

      elements.forEach(el => {
         const prev = first.get(el)
         if (!prev) return

         const next = el.getBoundingClientRect()
         const dx = prev.left - next.left
         const dy = prev.top - next.top

         if (!dx && !dy) return

         el.style.transition = "none"
         el.style.transform = `translate(${dx}px, ${dy}px)`

         requestAnimationFrame(() => {
            el.style.transition = "transform 300ms cubic-bezier(.22,.61,.36,1)"
            el.style.transform = ""
         })
      })
   }
}

export default animate